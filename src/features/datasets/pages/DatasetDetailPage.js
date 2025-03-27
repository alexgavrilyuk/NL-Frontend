// src/features/datasets/pages/DatasetDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import datasetService from '../services/datasetService';
import { useDatasets } from '../context/DatasetContext';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import DatasetDetail from '../components/DatasetDetail';
import SchemaEditor from '../components/SchemaEditor';
import MetadataForm from '../components/MetadataForm';
import Tabs from '../../shared/ui/Tabs';
import Loading from '../../shared/ui/Loading';
import ErrorState from '../../shared/ui/ErrorState';
import Modal from '../../shared/ui/Modal';
import Alert from '../../shared/ui/Alert';

const DatasetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateDataset, updateDatasetSchema } = useDatasets();

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [ignoreLoading, setIgnoreLoading] = useState(false);

  // Load dataset details
  useEffect(() => {
    const fetchDataset = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await datasetService.getDataset(id);
        setDataset(response.data.dataset);
      } catch (err) {
        console.error('Error loading dataset:', err);
        setError(err.message || 'Failed to load dataset details');
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [id]);

  // Handle schema update
  const handleSchemaUpdate = async (columns) => {
    try {
      const updatedSchema = await updateDatasetSchema(id, columns);

      // Update the local dataset state with new schema
      setDataset(prev => ({
        ...prev,
        schema: updatedSchema
      }));

      return updatedSchema;
    } catch (err) {
      console.error('Error updating schema:', err);
      throw err;
    }
  };

  // Handle metadata update
  const handleMetadataUpdate = async (metadata) => {
    try {
      const updatedDataset = await updateDataset(id, {
        name: metadata.name,
        description: metadata.description,
        metadata: metadata.metadata
      });

      setDataset(updatedDataset);

      return updatedDataset;
    } catch (err) {
      console.error('Error updating metadata:', err);
      throw err;
    }
  };

  // Handle dataset deletion
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);

      await datasetService.deleteDataset(id);

      // Redirect to datasets list
      navigate('/datasets');
    } catch (err) {
      console.error('Error deleting dataset:', err);
      setDeleteError(err.message || 'Failed to delete dataset');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle toggle ignore
  const handleToggleIgnore = async () => {
    try {
      setIgnoreLoading(true);

      const updatedDataset = await updateDataset(id, {
        ignored: !dataset.ignored
      });

      setDataset(updatedDataset);
    } catch (err) {
      console.error('Error updating dataset:', err);
      // Show error in UI
    } finally {
      setIgnoreLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-xl">
        <Loading text="Loading dataset details..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dataset"
        description={error}
        action={
          <Button
            variant="primary"
            as={Link}
            to="/datasets"
          >
            Back to Datasets
          </Button>
        }
      />
    );
  }

  if (!dataset) {
    return (
      <ErrorState
        title="Dataset not found"
        description="The requested dataset could not be found."
        action={
          <Button
            variant="primary"
            as={Link}
            to="/datasets"
          >
            Back to Datasets
          </Button>
        }
      />
    );
  }

  return (
    <div className="dataset-detail-page">
      <PageHeader
        title={dataset.name}
        subtitle={dataset.description}
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
        actions={
          <>
            <Button
              variant={dataset.ignored ? "primary" : "outline"}
              onClick={handleToggleIgnore}
              loading={ignoreLoading}
              disabled={ignoreLoading}
            >
              {dataset.ignored ? "Include in Analysis" : "Ignore Dataset"}
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Dataset
            </Button>
          </>
        }
      />

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'schema', label: 'Schema Editor' },
          { id: 'metadata', label: 'Metadata' }
        ]}
        className="mb-md"
      />

      <div className="tab-content">
        {activeTab === 'overview' && (
          <DatasetDetail dataset={dataset} />
        )}

        {activeTab === 'schema' && (
          <SchemaEditor
            schema={dataset.schema}
            onSave={handleSchemaUpdate}
          />
        )}

        {activeTab === 'metadata' && (
          <MetadataForm
            dataset={dataset}
            onSave={handleMetadataUpdate}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Dataset"
        size="sm"
      >
        <div className="py-md">
          {deleteError && (
            <Alert
              variant="error"
              className="mb-md"
            >
              {deleteError}
            </Alert>
          )}

          <p className="mb-md">
            Are you sure you want to delete "{dataset.name}"? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-sm">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteLoading}
              disabled={deleteLoading}
            >
              Delete Dataset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DatasetDetailPage;