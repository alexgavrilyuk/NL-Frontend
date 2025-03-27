// src/features/reporting/pages/ReportsListPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reportService from '../services/reportService';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import Table from '../../shared/ui/Table';
import Card from '../../shared/ui/Card';
import EmptyState from '../../shared/ui/EmptyState';
import Alert from '../../shared/ui/Alert';
import Modal from '../../shared/ui/Modal';
import Badge from '../../shared/ui/Badge';

const ReportsListPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportService.getReports(filter);
      setReports(response.data.reports);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      await reportService.deleteReport(reportToDelete.id);

      setShowDeleteModal(false);
      setReportToDelete(null);

      // Refresh the list
      loadReports();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete report');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row) => (
        <div>
          <Link to={`/reports/${row.id}`} className="font-medium text-primary-500 hover:text-primary-700">
            {row.name}
          </Link>
          {row.description && (
            <p className="text-sm text-text-tertiary">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (row) => formatDate(row.created)
    },
    {
      header: 'Modified',
      accessor: (row) => formatDate(row.modified)
    },
    {
      header: 'Visualizations',
      accessor: (row) => row.visualizationCount || '–'
    },
    {
      header: 'Type',
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
            to={`/reports/${row.id}`}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="reports-list-page">
      <PageHeader
        title="Reports"
        subtitle="View and manage your saved reports"
        actions={
          <Button
            variant="primary"
            as={Link}
            to="/prompt"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Create New Analysis
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

      <Card>
        <div className="filter-controls flex items-center gap-md mb-md">
          <div className="flex space-x-sm">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Reports
            </Button>
            <Button
              variant={filter === 'personal' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('personal')}
            >
              Personal
            </Button>
            <Button
              variant={filter === 'team' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('team')}
            >
              Team
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={reports}
          isLoading={loading}
          emptyState={
            <EmptyState
              title="No reports found"
              description="Create your first report by performing an analysis"
              action={
                <Button
                  variant="primary"
                  as={Link}
                  to="/prompt"
                >
                  Create New Analysis
                </Button>
              }
            />
          }
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Report"
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
            Are you sure you want to delete "{reportToDelete?.name}"? This action cannot be undone.
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
              Delete Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportsListPage;