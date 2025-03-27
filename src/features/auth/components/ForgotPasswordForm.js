// src/features/auth/components/ForgotPasswordForm.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email');
      setSuccess(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form className="bg-background-primary p-md rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-xxl font-bold text-center mb-md">Reset Password</h2>
        <p className="text-text-secondary text-center mb-lg">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <Alert
            variant="error"
            className="mb-md"
            onDismiss={() => setError(null)}
            dismissible
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            variant="success"
            className="mb-md"
          >
            Reset link sent! Check your email for instructions.
          </Alert>
        )}

        <div className="mb-lg">
          <Input
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={success}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading || success}
        >
          Send Reset Link
        </Button>

        <div className="mt-md text-center">
          <p className="text-text-secondary">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-700">
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;