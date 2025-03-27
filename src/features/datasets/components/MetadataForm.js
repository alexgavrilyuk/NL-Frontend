// src/features/datasets/components/MetadataForm.js

import React, { useState } from 'react';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const MetadataForm = ({ dataset, onSave }) => {
  const [formData, setFormData] = useState({
    name: dataset?.name || '',
    description: dataset?.description || '',
    metadata: {
      business: dataset?.metadata?.business || '',
      timeframe: dataset?.metadata?.timeframe || '',
      context: dataset?.metadata?.context || ''
    }
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested metadata fields
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
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

    if (!formData.name.trim()) {
      setError('Dataset name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await onSave(formData);

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save metadata');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Dataset Metadata" className="metadata-form">
      <form onSubmit={handleSubmit}>
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
            onDismiss={() => setSuccess(false)}
            dismissible
          >
            Metadata updated successfully
          </Alert>
        )}

        <div className="mb-md">
          <Input
            label="Dataset Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter a descriptive name"
            required
          />
        </div>

        <div className="mb-md">
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description of this dataset"
          />
        </div>

        <div className="mb-md">
          <h3 className="text-lg font-semibold mb-sm">Additional Context</h3>
          <p className="text-text-secondary mb-md">
            Providing context helps the AI better understand your data and generate more relevant insights.
          </p>

          <div className="mb-md">
            <Input
              label="Business Area"
              name="metadata.business"
              value={formData.metadata.business}
              onChange={handleChange}
              placeholder="E.g., Retail, Finance, Marketing"
            />
          </div>

          <div className="mb-md">
            <Input
              label="Timeframe"
              name="metadata.timeframe"
              value={formData.metadata.timeframe}
              onChange={handleChange}
              placeholder="E.g., Q3 2024, January-March 2024"
            />
          </div>

          <div className="mb-lg">
            <Input
              label="Additional Context"
              name="metadata.context"
              value={formData.metadata.context}
              onChange={handleChange}
              placeholder="Any other relevant information about this dataset"
              as="textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving}
          >
            Save Metadata
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MetadataForm;