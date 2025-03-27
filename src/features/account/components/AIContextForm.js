// src/features/account/components/AIContextForm.js

import React, { useState } from 'react';
import { useAccount } from '../context/AccountContext';
import Select from '../../shared/ui/Select';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const AIContextForm = () => {
  const { preferences, updatePreferences, loading, error, clearError } = useAccount();
  const [formData, setFormData] = useState({
    industry: preferences?.industry || '',
    businessType: preferences?.businessType || '',
    aiContext: {
      financialYear: preferences?.aiContext?.financialYear || 'January-December',
      reportingPeriod: preferences?.aiContext?.reportingPeriod || 'Quarterly',
      companySize: preferences?.aiContext?.companySize || 'Small',
      analysisPreference: preferences?.aiContext?.analysisPreference || 'detailed'
    }
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('aiContext.')) {
      const contextKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        aiContext: {
          ...prev.aiContext,
          [contextKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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
      await updatePreferences(formData);
      setSuccess(true);
    } catch (err) {
      // Error is handled by the context
      console.error('AI context update error:', err);
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
          {error.message || 'An error occurred while updating your AI context settings.'}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          AI context settings updated successfully!
        </Alert>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-sm">Business Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <Select
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select an industry' },
                { value: 'Financial Services', label: 'Financial Services' },
                { value: 'Banking', label: 'Banking' },
                { value: 'Insurance', label: 'Insurance' },
                { value: 'Retail', label: 'Retail' },
                { value: 'Manufacturing', label: 'Manufacturing' },
                { value: 'Technology', label: 'Technology' },
                { value: 'Healthcare', label: 'Healthcare' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Business Type"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select a business type' },
                { value: 'Corporate Finance', label: 'Corporate Finance' },
                { value: 'Investment Banking', label: 'Investment Banking' },
                { value: 'Retail Banking', label: 'Retail Banking' },
                { value: 'Asset Management', label: 'Asset Management' },
                { value: 'E-commerce', label: 'E-commerce' },
                { value: 'SaaS', label: 'SaaS' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-sm">Financial Context</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <Select
              label="Financial Year"
              name="aiContext.financialYear"
              value={formData.aiContext.financialYear}
              onChange={handleChange}
              options={[
                { value: 'January-December', label: 'January-December' },
                { value: 'April-March', label: 'April-March' },
                { value: 'July-June', label: 'July-June' },
                { value: 'October-September', label: 'October-September' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Reporting Period"
              name="aiContext.reportingPeriod"
              value={formData.aiContext.reportingPeriod}
              onChange={handleChange}
              options={[
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Quarterly', label: 'Quarterly' },
                { value: 'Semi-Annually', label: 'Semi-Annually' },
                { value: 'Annually', label: 'Annually' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Company Size"
              name="aiContext.companySize"
              value={formData.aiContext.companySize}
              onChange={handleChange}
              options={[
                { value: 'Small', label: 'Small (1-50 employees)' },
                { value: 'Medium', label: 'Medium (51-500 employees)' },
                { value: 'Large', label: 'Large (501-5000 employees)' },
                { value: 'Enterprise', label: 'Enterprise (5000+ employees)' }
              ]}
            />
          </div>

          <div>
            <Select
              label="Analysis Preference"
              name="aiContext.analysisPreference"
              value={formData.aiContext.analysisPreference}
              onChange={handleChange}
              options={[
                { value: 'detailed', label: 'Detailed (comprehensive analysis)' },
                { value: 'summary', label: 'Summary (key insights only)' },
                { value: 'technical', label: 'Technical (more in-depth metrics)' },
                { value: 'executive', label: 'Executive (high-level overview)' }
              ]}
            />
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
          Save AI Context Settings
        </Button>
      </div>
    </form>
  );
};

export default AIContextForm;