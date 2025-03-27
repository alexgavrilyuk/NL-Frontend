// src/features/prompt/components/PromptContextSettings.js

import React, { useState } from 'react';
import Card from '../../shared/ui/Card';
import Select from '../../shared/ui/Select';
import Button from '../../shared/ui/Button';
import Tooltip from '../../shared/ui/Tooltip';

const PromptContextSettings = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings || {
    visualizationType: 'auto',
    includeInsights: true,
    language: 'en',
    displayCurrency: 'USD',
    fiscalYearStart: 'January'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsEditing(false);
  };

  return (
    <Card
      title="Analysis Settings"
      className="h-full"
      headerActions={
        !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            }
          >
            Edit
          </Button>
        )
      }
    >
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-md">
            <div>
              <label className="flex items-center mb-sm">
                <span className="text-sm font-medium mr-2">Visualization Type</span>
                <Tooltip content="Choose how to visualize your data. Auto lets NeuroLedger decide the best visualization.">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </Tooltip>
              </label>
              <Select
                name="visualizationType"
                value={localSettings.visualizationType}
                onChange={handleChange}
                options={[
                  { value: 'auto', label: 'Auto (Recommended)' },
                  { value: 'bar', label: 'Bar Charts' },
                  { value: 'line', label: 'Line Charts' },
                  { value: 'pie', label: 'Pie Charts' },
                  { value: 'table', label: 'Tables' },
                ]}
              />
            </div>

            <div>
              <label className="flex items-center mb-sm">
                <span className="text-sm font-medium mr-2">Currency</span>
                <Tooltip content="Select the currency to use in financial calculations and displays.">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </Tooltip>
              </label>
              <Select
                name="displayCurrency"
                value={localSettings.displayCurrency}
                onChange={handleChange}
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' },
                  { value: 'JPY', label: 'JPY (¥)' },
                  { value: 'CAD', label: 'CAD (C$)' },
                  { value: 'AUD', label: 'AUD (A$)' },
                ]}
              />
            </div>

            <div>
              <label className="flex items-center mb-sm">
                <span className="text-sm font-medium mr-2">Fiscal Year Start</span>
                <Tooltip content="Sets the starting month of fiscal year for financial calculations.">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </Tooltip>
              </label>
              <Select
                name="fiscalYearStart"
                value={localSettings.fiscalYearStart}
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
                  { value: 'December', label: 'December' },
                ]}
              />
            </div>

            <div>
              <label className="flex items-center mb-sm">
                <span className="text-sm font-medium mr-2">Language</span>
                <Tooltip content="Choose the language for analysis and insights.">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </Tooltip>
              </label>
              <Select
                name="language"
                value={localSettings.language}
                onChange={handleChange}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'it', label: 'Italian' },
                ]}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeInsights"
                name="includeInsights"
                checked={localSettings.includeInsights}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="includeInsights" className="text-sm font-medium cursor-pointer">
                Include narrative insights
              </label>
              <Tooltip content="When enabled, NeuroLedger will generate textual explanations and insights about your data.">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-tertiary ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </Tooltip>
            </div>

            <div className="flex justify-end space-x-sm pt-md">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Settings
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-md text-sm">
          <div className="grid grid-cols-2 gap-sm">
            <div>
              <p className="font-medium">Visualization Type</p>
              <p className="text-text-secondary">
                {localSettings.visualizationType === 'auto'
                  ? 'Auto (Recommended)'
                  : localSettings.visualizationType.charAt(0).toUpperCase() + localSettings.visualizationType.slice(1)}
              </p>
            </div>
            <div>
              <p className="font-medium">Currency</p>
              <p className="text-text-secondary">{localSettings.displayCurrency}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div>
              <p className="font-medium">Fiscal Year Start</p>
              <p className="text-text-secondary">{localSettings.fiscalYearStart}</p>
            </div>
            <div>
              <p className="font-medium">Language</p>
              <p className="text-text-secondary">
                {localSettings.language === 'en' ? 'English' :
                 localSettings.language === 'es' ? 'Spanish' :
                 localSettings.language === 'fr' ? 'French' :
                 localSettings.language === 'de' ? 'German' :
                 localSettings.language === 'it' ? 'Italian' :
                 localSettings.language}
              </p>
            </div>
          </div>

          <div>
            <p className="font-medium">Insights</p>
            <p className="text-text-secondary">
              {localSettings.includeInsights ? 'Include narrative insights' : 'No narrative insights'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PromptContextSettings;