// src/features/account/components/ProfileForm.js

import React, { useState } from 'react';
import { useAccount } from '../context/AccountContext';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const ProfileForm = () => {
  const { profile, updateProfile, loading, error, clearError } = useAccount();
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    bio: profile?.bio || '',
    phoneNumber: profile?.phoneNumber || '',
    position: profile?.position || '',
    company: profile?.company || ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear success message on form change
    if (success) setSuccess(false);
    // Clear error on form change
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await updateProfile(formData);
      setSuccess(true);
    } catch (err) {
      // Error is handled by the context
      console.error('Profile update error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      {error && (
        <Alert
          variant="error"
          onDismiss={clearError}
          dismissible
        >
          {error.message || 'An error occurred while updating your profile.'}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          Profile updated successfully!
        </Alert>
      )}

      <div>
        <Input
          label="Display Name"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <Input
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="A brief description about yourself"
          required={false}
          suffix={<span className="text-xs text-text-tertiary">{formData.bio.length}/200</span>}
        />
      </div>

      <div>
        <Input
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Your phone number"
          required={false}
        />
      </div>

      <div>
        <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Your job title"
          required={false}
        />
      </div>

      <div>
        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Your company name"
          required={false}
        />
      </div>

      <div className="pt-md">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;