// src/features/datasets/pages/DatasetUploadPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDatasets } from '../context/DatasetContext';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import FileUploader from '../components/FileUploader';
import Alert from '../../shared/ui/Alert';

const DatasetUploadPage = () => {
  const navigate = useNavigate();
  const { uploadDataset } = useDatasets();

  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (fileData) => {
    setFile(fileData);
    if (!name) {
      // Extract name from filename (remove extension)
      const fileName = fileData.name.split('.')[0];
      setName(fileName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a file');
      return;
    }

    if (!name) {
      setError('Please enter a name for the dataset');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const dataset = await uploadDataset(file, name, description);

      // Navigate to the new dataset's detail page
      navigate(`/datasets/${dataset.id}`);
    } catch (err) {
      console.error('Error uploading dataset:', err);
      setError(err.message || 'Failed to upload dataset');
      setUploading(false);
    }
  };

  return (
    <div className="dataset-upload-page">
      <PageHeader
        title="Upload Dataset"
        subtitle="Upload CSV or Excel files for analysis"
        backLink={
          <Button
            variant="ghost"
            as={Link}
            to="/datasets"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
          >
            Back to Datasets
          </Button>
        }
      />

      <Card>
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

          <div className="mb-lg">
            <FileUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={(error) => setError(error)}
              maxFileSize={10}
            />
          </div>

          {file && (
            <>
              <div className="mb-md">
                <Input
                  label="Dataset Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a descriptive name"
                  required
                />
              </div>

              <div className="mb-lg">
                <Input
                  label="Description (Optional)"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description of this dataset"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="mr-sm"
                  onClick={() => navigate('/datasets')}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={uploading}
                  disabled={uploading}
                >
                  Upload Dataset
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </div>
  );
};

export default DatasetUploadPage;