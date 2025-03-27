// src/features/account/components/SecuritySettings.js

import React, { useState } from 'react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear messages on form change
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError({ message: 'New passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setError({ message: 'Password must be at least 8 characters long' });
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No authenticated user');
      }

      // Create credential for reauthentication
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );

      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccess(true);
    } catch (err) {
      console.error('Password update error:', err);

      if (err.code === 'auth/wrong-password') {
        setError({ message: 'Current password is incorrect' });
      } else if (err.code === 'auth/weak-password') {
        setError({ message: 'New password is too weak' });
      } else {
        setError({ message: err.message || 'Failed to update password' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      {error && (
        <Alert
          variant="error"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error.message}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          Password updated successfully!
        </Alert>
      )}

      <div>
        <Input
          type="password"
          label="Current Password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
          required
        />
      </div>

      <div>
        <Input
          type="password"
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
          helperText="Password must be at least 8 characters long"
        />
      </div>

      <div>
        <Input
          type="password"
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
        />
      </div>

      <div className="pt-md">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Update Password
        </Button>
      </div>
    </form>
  );
};

export default SecuritySettings;