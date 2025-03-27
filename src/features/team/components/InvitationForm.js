// src/features/team/components/InvitationForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTeam } from '../context/TeamContext';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import Select from '../../shared/ui/Select';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import Tooltip from '../../shared/ui/Tooltip';

const InvitationForm = ({ teamId }) => {
  const { inviteMember, loading } = useTeam();

  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset alerts
    setError(null);
    setSuccess(null);

    // Validate form
    if (!formData.email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await inviteMember(teamId, formData);
      setSuccess(`Invitation sent to ${formData.email} successfully!`);

      // Reset form
      setFormData({
        email: '',
        role: 'member',
        message: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to send invitation');
    }
  };

  const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <Card title="Invite Team Member" className="mb-lg">
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
          onDismiss={() => setSuccess(null)}
          dismissible
        >
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <Input
            type="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="mb-md">
          <Select
            name="role"
            label={
              <div className="flex items-center">
                <span>Role</span>
                <Tooltip content="Admins can manage team members and settings. Members can only view and use team resources.">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-text-tertiary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </Tooltip>
              </div>
            }
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
          />
        </div>

        <div className="mb-lg">
          <Input
            type="text"
            name="message"
            label="Personal Message (optional)"
            value={formData.message}
            onChange={handleChange}
            placeholder="Add a personal message to your invitation"
            multiline
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Send Invitation
          </Button>
        </div>
      </form>
    </Card>
  );
};

InvitationForm.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default InvitationForm;