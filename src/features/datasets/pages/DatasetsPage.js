// src/features/datasets/pages/DatasetsPage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatasets } from '../context/DatasetContext';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import DatasetList from '../components/DatasetList';
import Select from '../../shared/ui/Select';
import Modal from '../../shared/ui/Modal';
import Alert from '../../shared/ui/Alert';

const DatasetsPage = () => {
  const {
    datasets,
    loading,
    error,
    filter,
    includeIgnored,
    deleteDataset,
    setDatasetFilter,
    toggleIncludeIgnored
  } = useDatasets();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = (datasetId) => {
    const dataset = datasets.find(d => d.id === datasetId);
    setDatasetToDelete(dataset);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!datasetToDelete) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      await deleteDataset(datasetToDelete.id);

      setShowDeleteModal(false);
      setDatasetToDelete(null);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete dataset');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="datasets-page">
      <PageHeader
        title="Datasets"
        subtitle="Upload and manage your financial datasets"
        actions={
          <Button
            variant="primary"
            as={Link}
            to="/datasets/new"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Upload Dataset
          </Button>
        }
      />

      {error && (
        <Alert
          variant="error"
          className="mb-md"
        >
          {error}
        </Alert>
      )}

      <div className="filter-controls flex flex-wrap items-center gap-md mb-md">
        <div className="w-48">
          <Select
            name="datasetFilter"
            value={filter}
            onChange={(e) => setDatasetFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Datasets' },
              { value: 'personal', label: 'Personal Datasets' },
              { value: 'team', label: 'Team Datasets' }
            ]}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeIgnored"
            checked={includeIgnored}
            onChange={toggleIncludeIgnored}
            className="mr-2"
          />
          <label htmlFor="includeIgnored" className="text-text-secondary">
            Include ignored datasets
          </label>
        </div>
      </div>

      <div className="card-container bg-background-primary rounded-lg border border-border-light shadow-sm">
        <DatasetList
          datasets={datasets}
          isLoading={loading}
          onDelete={handleDelete}
        />
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
            Are you sure you want to delete "{datasetToDelete?.name}"? This action cannot be undone.
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
              onClick={confirmDelete}
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

export default DatasetsPage;