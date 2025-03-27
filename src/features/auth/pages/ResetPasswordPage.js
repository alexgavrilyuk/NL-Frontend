// src/features/auth/pages/ResetPasswordPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import { useTheme } from '../../../core/theme/ThemeProvider';
import firebase from 'firebase/app';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oobCode, setOobCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Extract action code from URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('oobCode');

    if (code) {
      setOobCode(code);
    } else {
      setError('Invalid password reset link. Please request a new one.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!oobCode) {
      setError('Invalid password reset link. Please request a new one.');
      return;
    }

    setLoading(true);

    try {
      // Firebase password reset confirmation
      await firebase.auth().confirmPasswordReset(oobCode, password);

      setSuccess(true);
      setError(null);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);

      if (err.code === 'auth/expired-action-code') {
        setError('This password reset link has expired. Please request a new one.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError('Invalid password reset link. Please request a new one.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-secondary p-md relative">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-background-primary text-text-primary focus:outline-none"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-md mb-md">
        <div className="text-center mb-lg">
          <h1 className="text-xxxl font-bold text-primary-500">NeuroLedger</h1>
          <p className="text-text-secondary">Advanced financial analytics powered by AI</p>
        </div>

        <div className="w-full max-w-md">
          <form className="bg-background-primary p-md rounded-lg shadow-md" onSubmit={handleSubmit}>
            <h2 className="text-xxl font-bold text-center mb-md">Reset Password</h2>

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
                Password reset successfully! Redirecting you to login...
              </Alert>
            )}

            {!success && (
              <>
                <div className="mb-md">
                  <Input
                    type="password"
                    label="New Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={!oobCode}
                  />
                  <p className="mt-1 text-xs text-text-tertiary">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="mb-lg">
                  <Input
                    type="password"
                    label="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={!oobCode}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading || !oobCode}
                >
                  Reset Password
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;