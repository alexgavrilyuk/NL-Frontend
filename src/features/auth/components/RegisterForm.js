// src/features/auth/components/RegisterForm.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const { register, loading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.displayName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.displayName);
      // Successful registration will redirect in the parent component
    } catch (err) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form className="bg-background-primary p-md rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-xxl font-bold text-center mb-lg">Create an Account</h2>

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
            type="text"
            label="Name"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="mb-md">
          <Input
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-md">
          <Input
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
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
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Sign Up
        </Button>

        <div className="mt-md text-center">
          <p className="text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-700">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;