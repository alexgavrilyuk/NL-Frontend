// src/features/reporting/pages/ReportPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import reportService from '../services/reportService';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import Loading from '../../shared/ui/Loading';
import ErrorState from '../../shared/ui/ErrorState';
import Alert from '../../shared/ui/Alert';
import Modal from '../../shared/ui/Modal';
import DynamicDashboard from '../components/DynamicDashboard';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmails, setShareEmails] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isPdfExporting, setIsPdfExporting] = useState(false);

  const reportContainerRef = useRef(null);

  // Load report details
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await reportService.getReport(id);
        setReport(response.data.report);
      } catch (err) {
        console.error('Error loading report:', err);
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Handle PDF export
  const handleExportPdf = async () => {
    try {
      setExportLoading(true);
      setExportError(null);
      setIsPdfExporting(true);

      const response = await reportService.exportReport(id, 'pdf', {
        includeInsights: true,
        quality: 'high'
      });

      // Open export URL in new tab
      window.open(response.data.exportUrl, '_blank');
    } catch (err) {
      console.error('Error exporting report:', err);
      setExportError(err.message || 'Failed to export report');
    } finally {
      setExportLoading(false);
      setIsPdfExporting(false);
    }
  };

  // Handle sharing the report
  const handleShare = async (e) => {
    e.preventDefault();

    if (!shareEmails.trim()) {
      setShareError('Please enter at least one email address');
      return;
    }

    try {
      setShareLoading(true);
      setShareError(null);
      setShareSuccess(false);

      // Split emails by comma and trim whitespace
      const emails = shareEmails.split(',').map(email => email.trim()).filter(Boolean);

      await reportService.shareReport(id, emails, shareMessage);

      setShareSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setShowShareModal(false);
        setShareEmails('');
        setShareMessage('');
        setShareSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error sharing report:', err);
      setShareError(err.message || 'Failed to share report');
    } finally {
      setShareLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-xl">
        <Loading text="Loading report..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load report"
        description={error}
        action={
          <Button
            variant="primary"
            as={Link}
            to="/reports"
          >
            Back to Reports
          </Button>
        }
      />
    );
  }

  if (!report) {
    return (
      <ErrorState
        title="Report not found"
        description="The requested report could not be found."
        action={
          <Button
            variant="primary"
            as={Link}
            to="/reports"
          >
            Back to Reports
          </Button>
        }
      />
    );
  }

  return (
    <div className="report-page">
      <PageHeader
        title={report.name}
        subtitle={report.description}
        backLink={
          <Button
            variant="ghost"
            as={Link}
            to="/reports"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
          >
            Back to Reports
          </Button>
        }
        actions={
          <div className="flex space-x-sm">
            <Button
              variant="outline"
              onClick={() => setShowShareModal(true)}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              }
            >
              Share
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPdf}
              loading={exportLoading}
              disabled={exportLoading}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              }
            >
              Export PDF
            </Button>
          </div>
        }
      />

      {exportError && (
        <Alert
          variant="error"
          className="mb-md"
          onDismiss={() => setExportError(null)}
          dismissible
        >
          {exportError}
        </Alert>
      )}

      {/* PDF export indicator */}
      {isPdfExporting && (
        <Alert
          variant="info"
          className="mb-md"
        >
          Your PDF is being generated. When ready, it will open in a new tab.
        </Alert>
      )}

      {/* Report container */}
      <div className="report-container mb-lg" ref={reportContainerRef}>
        <Card className="p-0 overflow-hidden">
          {/* Dynamic dashboard for executing the report's code */}
          <DynamicDashboard
            code={report.code}
            data={{
              visualizations: report.visualizations,
              insights: report.insights,
              ...report.data
            }}
          />
        </Card>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Report"
        size="md"
      >
        <form onSubmit={handleShare} className="py-md">
          {shareError && (
            <Alert
              variant="error"
              className="mb-md"
              dismissible
              onDismiss={() => setShareError(null)}
            >
              {shareError}
            </Alert>
          )}

          {shareSuccess && (
            <Alert
              variant="success"
              className="mb-md"
            >
              Report shared successfully!
            </Alert>
          )}

          <div className="mb-md">
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email Addresses
            </label>
            <input
              type="text"
              value={shareEmails}
              onChange={(e) => setShareEmails(e.target.value)}
              placeholder="Enter email addresses, separated by commas"
              className="w-full p-md border border-border-normal rounded-md"
              disabled={shareLoading || shareSuccess}
            />
            <p className="mt-1 text-sm text-text-tertiary">
              Recipients will receive an email with a link to this report.
            </p>
          </div>

          <div className="mb-lg">
            <label className="block text-sm font-medium text-text-primary mb-1">
              Message (Optional)
            </label>
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="w-full p-md border border-border-normal rounded-md"
              rows={3}
              disabled={shareLoading || shareSuccess}
            />
          </div>

          <div className="flex justify-end space-x-sm">
            <Button
              variant="ghost"
              onClick={() => setShowShareModal(false)}
              disabled={shareLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={shareLoading}
              disabled={shareLoading || shareSuccess}
            >
              Share Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReportPage;