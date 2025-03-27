// src/features/team/components/CreateTeamForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import Select from '../../shared/ui/Select';

const CreateTeamForm = () => {
  const navigate = useNavigate();
  const { createTeam, loading, error: contextError } = useTeam();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    context: {
      business: '',
      industry: '',
      preferences: {
        fiscalYearStart: 'January',
        reportingCurrency: 'USD'
      }
    }
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('context.preferences.')) {
      const prefField = name.split('.')[2];
      setFormData(prev => ({
        ...prev,
        context: {
          ...prev.context,
          preferences: {
            ...prev.context.preferences,
            [prefField]: value
          }
        }
      }));
    } else if (name.startsWith('context.')) {
      const contextField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        context: {
          ...prev.context,
          [contextField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError(null);

    try {
      // Basic validation
      if (!formData.name.trim()) {
        setError('Team name is required');
        return;
      }

      const newTeam = await createTeam(formData);
      navigate(`/team/${newTeam.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create team');
    }
  };

  return (
    <Card title="Create New Team" className="max-w-2xl mx-auto">
      {(contextError || error) && (
        <Alert
          variant="error"
          className="mb-md"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error || contextError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <Input
            type="text"
            name="name"
            label="Team Name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter team name"
            required
          />
        </div>

        <div className="mb-lg">
          <Input
            type="text"
            name="description"
            label="Team Description (optional)"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly describe the team's purpose"
            multiline
            rows={3}
          />
        </div>

        <h3 className="text-lg font-semibold mb-md">Team Context Settings</h3>
        <p className="text-text-secondary mb-md">
          These settings provide context to the AI when generating reports for your team.
        </p>

        <div className="space-y-md mb-lg">
          <Input
            type="text"
            name="context.business"
            label="Business Type"
            value={formData.context.business}
            onChange={handleChange}
            placeholder="e.g., Financial Services, Retail, Manufacturing"
          />

          <Input
            type="text"
            name="context.industry"
            label="Industry"
            value={formData.context.industry}
            onChange={handleChange}
            placeholder="e.g., Banking, Apparel, Automotive"
          />

          <Select
            name="context.preferences.fiscalYearStart"
            label="Fiscal Year Start"
            value={formData.context.preferences.fiscalYearStart}
            onChange={handleChange}
            options={[
              { value: 'January', label: 'January' },
              { value: 'February', label: 'February' },
              { value: 'March', label: 'March' },
              { value: 'April', label: 'April' },
              { value: 'May', label: 'May' },
              { value: 'June', label: 'June' },
              { value: 'July', label: 'July' },
              { value: 'August', label: 'August' },
              { value: 'September', label: 'September' },
              { value: 'October', label: 'October' },
              { value: 'November', label: 'November' },
              { value: 'December', label: 'December' }
            ]}
          />

          <Select
            name="context.preferences.reportingCurrency"
            label="Reporting Currency"
            value={formData.context.preferences.reportingCurrency}
            onChange={handleChange}
            options={[
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'GBP', label: 'GBP - British Pound' },
              { value: 'JPY', label: 'JPY - Japanese Yen' },
              { value: 'CAD', label: 'CAD - Canadian Dollar' },
              { value: 'AUD', label: 'AUD - Australian Dollar' },
              { value: 'CHF', label: 'CHF - Swiss Franc' }
            ]}
          />
        </div>

        <div className="flex justify-end space-x-md">
          <Button
            variant="ghost"
            onClick={() => navigate('/team')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Create Team
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateTeamForm;