// src/features/auth/components/LoginForm.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login(email, password);
      // Successful login will redirect in the parent component
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form className="bg-background-primary p-md rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-xxl font-bold text-center mb-lg">Login to NeuroLedger</h2>

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

        <div className="mb-md">
          <Input
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-lg">
          <Input
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Log In
        </Button>

        <div className="mt-md text-center">
          <p className="text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;