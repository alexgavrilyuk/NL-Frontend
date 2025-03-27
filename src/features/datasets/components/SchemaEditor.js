// src/features/datasets/components/SchemaEditor.js

import React, { useState } from 'react';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import Select from '../../shared/ui/Select';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';

const SchemaEditor = ({ schema, onSave }) => {
  const [columns, setColumns] = useState(schema?.columns || []);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!schema) {
    return (
      <Alert variant="warning">
        Schema information is not available for this dataset.
      </Alert>
    );
  }

  const handleColumnChange = (index, field, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: value
    };
    setColumns(updatedColumns);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate all columns have names
      const hasEmptyName = columns.some(col => !col.name.trim());
      if (hasEmptyName) {
        setError('All columns must have a name');
        return;
      }

      await onSave(columns);
    } catch (err) {
      setError(err.message || 'Failed to save schema changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card title="Edit Schema" className="schema-editor">
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
        <p className="text-text-secondary mb-sm">
          Enhance your dataset by providing descriptions for columns. This helps the AI better understand your data.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-background-secondary">
              <th className="px-md py-sm text-left font-semibold text-text-secondary">Column Name</th>
              <th className="px-md py-sm text-left font-semibold text-text-secondary">Data Type</th>
              <th className="px-md py-sm text-left font-semibold text-text-secondary">Description</th>
              <th className="px-md py-sm text-left font-semibold text-text-secondary">Sample Values</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((column, index) => (
              <tr key={index} className="border-b border-border-light">
                <td className="px-md py-sm">
                  <Input
                    name={`column-${index}-name`}
                    value={column.name}
                    onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                    size="sm"
                  />
                </td>
                <td className="px-md py-sm">
                  <Select
                    name={`column-${index}-type`}
                    value={column.type}
                    onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                    options={[
                      { value: 'string', label: 'Text' },
                      { value: 'number', label: 'Number' },
                      { value: 'date', label: 'Date' },
                      { value: 'boolean', label: 'Boolean' },
                      { value: 'object', label: 'Object' }
                    ]}
                    size="sm"
                  />
                </td>
                <td className="px-md py-sm">
                  <Input
                    name={`column-${index}-description`}
                    value={column.description || ''}
                    onChange={(e) => handleColumnChange(index, 'description', e.target.value)}
                    placeholder="E.g., Monthly revenue in USD"
                    size="sm"
                  />
                </td>
                <td className="px-md py-sm text-sm text-text-tertiary">
                  {column.examples && column.examples.slice(0, 3).map((example, i) => (
                    <span key={i} className="mr-sm">
                      {typeof example === 'object' ? JSON.stringify(example) : String(example)}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-lg flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving}
        >
          Save Schema Changes
        </Button>
      </div>
    </Card>
  );
};

export default SchemaEditor;