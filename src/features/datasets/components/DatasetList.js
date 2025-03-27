// src/features/datasets/components/DatasetList.js

import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../shared/ui/Table';
import Badge from '../../shared/ui/Badge';
import Button from '../../shared/ui/Button';
import EmptyState from '../../shared/ui/EmptyState';

const DatasetList = ({ datasets, isLoading, onDelete }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 mr-sm flex items-center justify-center bg-background-secondary rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <Link to={`/datasets/${row.id}`} className="font-medium text-primary-500 hover:text-primary-700">
              {row.name}
            </Link>
            {row.description && (
              <p className="text-sm text-text-tertiary">{row.description}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: (row) => {
        const extension = row.fileInfo.originalName.split('.').pop().toLowerCase();
        return (
          <Badge variant={extension === 'csv' ? 'info' : 'primary'} size="sm">
            {extension.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      header: 'Size',
      accessor: (row) => formatFileSize(row.fileInfo.size)
    },
    {
      header: 'Rows',
      accessor: (row) => row.schema?.rowCount || '–'
    },
    {
      header: 'Added',
      accessor: (row) => formatDate(row.created)
    },
    {
      header: 'Team',
      accessor: (row) => row.teamId ? (
        <Badge variant="success" size="sm">Team</Badge>
      ) : (
        <Badge variant="default" size="sm">Personal</Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-sm">
          <Button
            variant="secondary"
            size="sm"
            as={Link}
            to={`/datasets/${row.id}`}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (datasets.length === 0 && !isLoading) {
    return (
      <EmptyState
        title="No datasets found"
        description="Upload your first dataset to get started with analysis."
        action={
          <Button
            variant="primary"
            as={Link}
            to="/datasets/new"
          >
            Upload Dataset
          </Button>
        }
      />
    );
  }

  return (
    <Table
      columns={columns}
      data={datasets}
      isLoading={isLoading}
      emptyState={
        <EmptyState
          title="No datasets found"
          description="Try a different filter or upload a new dataset."
          action={
            <Button
              variant="primary"
              as={Link}
              to="/datasets/new"
            >
              Upload Dataset
            </Button>
          }
        />
      }
    />
  );
};

export default DatasetList;