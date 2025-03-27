// src/features/account/components/SettingsForm.js

import React, { useState } from 'react';
import { useAccount } from '../context/AccountContext';
import Input from '../../shared/ui/Input';
import Select from '../../shared/ui/Select';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import ThemeSelector from './ThemeSelector';

const SettingsForm = () => {
  const { settings, updateSettings, loading, error, clearError } = useAccount();
  const [formData, setFormData] = useState({
    currency: settings?.currency || 'USD',
    dateFormat: settings?.dateFormat || 'MM/DD/YYYY',
    timeFormat: settings?.timeFormat || '12h',
    language: settings?.language || 'en',
    notifications: {
      email: settings?.notifications?.email ?? true,
      app: settings?.notifications?.app ?? true
    }
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear success message on form change
    if (success) setSuccess(false);
    // Clear error on form change
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await updateSettings(formData);
      setSuccess(true);
    } catch (err) {
      // Error is handled by the context
      console.error('Settings update error:', err);
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
          {error.message || 'An error occurred while updating your settings.'}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          Settings updated successfully!
        </Alert>
      )}

      <div className="pb-md">
        <h3 className="text-lg font-semibold mb-sm">Theme</h3>
        <ThemeSelector />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-sm">Display Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <Select
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={[
                { value: 'USD', label: 'US Dollar ($)' },
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'GBP', label: 'British Pound (£)' },
                { value: 'JPY', label: 'Japanese Yen (¥)' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Date Format"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              options={[
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Time Format"
              name="timeFormat"
              value={formData.timeFormat}
              onChange={handleChange}
              options={[
                { value: '12h', label: '12-hour (e.g. 3:30 PM)' },
                { value: '24h', label: '24-hour (e.g. 15:30)' }
              ]}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-sm">Notifications</h3>

        <div className="space-y-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications.email"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleChange}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-border-normal rounded"
            />
            <label htmlFor="notifications.email" className="ml-sm text-text-primary">
              Email Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications.app"
              name="notifications.app"
              checked={formData.notifications.app}
              onChange={handleChange}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-border-normal rounded"
            />
            <label htmlFor="notifications.app" className="ml-sm text-text-primary">
              In-App Notifications
            </label>
          </div>
        </div>
      </div>

      <div className="pt-md">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Save Settings
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;