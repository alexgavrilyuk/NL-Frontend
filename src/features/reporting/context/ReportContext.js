// src/features/reporting/context/ReportContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import reportService from '../services/reportService';

// Create context
const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Load reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  // Function to load reports from API
  const loadReports = async (filter = 'all') => {
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

  // Select a report by ID
  const selectReport = async (id) => {
    if (id === selectedReportId && selectedReport) return selectedReport;

    try {
      setSelectedReportId(id);
      setLoading(true);
      setError(null);

      const response = await reportService.getReport(id);
      setSelectedReport(response.data.report);
      return response.data.report;
    } catch (err) {
      console.error('Error loading report:', err);
      setError(err.message || 'Failed to load report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new report
  const createReport = async (reportData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportService.createReport(reportData);

      // Add to reports list
      setReports(prevReports => [response.data.report, ...prevReports]);

      return response.data.report;
    } catch (err) {
      console.error('Error creating report:', err);
      setError(err.message || 'Failed to create report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a report
  const updateReport = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportService.updateReport(id, updates);

      // Update in reports list
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === id ? response.data.report : report
        )
      );

      // Update selected report if it's the one being updated
      if (selectedReportId === id) {
        setSelectedReport(response.data.report);
      }

      return response.data.report;
    } catch (err) {
      console.error('Error updating report:', err);
      setError(err.message || 'Failed to update report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a report
  const deleteReport = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await reportService.deleteReport(id);

      // Remove from reports list
      setReports(prevReports => prevReports.filter(report => report.id !== id));

      // Clear selected report if it's the one being deleted
      if (selectedReportId === id) {
        setSelectedReportId(null);
        setSelectedReport(null);
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      setError(err.message || 'Failed to delete report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Export a report
  const exportReport = async (id, format = 'pdf', options = {}) => {
    try {
      const response = await reportService.exportReport(id, format, options);
      return response.data;
    } catch (err) {
      console.error('Error exporting report:', err);
      setError(err.message || 'Failed to export report');
      throw err;
    }
  };

  // Share a report
  const shareReport = async (id, emails, message = '') => {
    try {
      const response = await reportService.shareReport(id, emails, message);
      return response.data;
    } catch (err) {
      console.error('Error sharing report:', err);
      setError(err.message || 'Failed to share report');
      throw err;
    }
  };

  // Context value
  const value = {
    reports,
    loading,
    error,
    selectedReportId,
    selectedReport,
    loadReports,
    selectReport,
    createReport,
    updateReport,
    deleteReport,
    exportReport,
    shareReport,
    setError
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};

// Custom hook for using the report context
export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};

export default ReportContext;