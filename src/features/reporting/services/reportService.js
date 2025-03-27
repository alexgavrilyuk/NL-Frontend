// src/features/reporting/services/reportService.js

import apiClient from '../../shared/api/apiClient';

class ReportService {
  /**
   * Create a new report
   * @param {Object} reportData - The report data (name, description, promptId, visualizations, insights)
   * @returns {Promise} API response
   */
  async createReport(reportData) {
    const response = await apiClient.post('/reports', reportData);
    return response.data;
  }

  /**
   * Get a list of all user reports
   * @param {string} filter - Filter type: 'all', 'personal', 'team'
   * @param {number} limit - Number of reports to return
   * @param {number} page - Page number for pagination
   * @returns {Promise} API response with reports list
   */
  async getReports(filter = 'all', limit = 10, page = 1) {
    const response = await apiClient.get(`/reports?filter=${filter}&limit=${limit}&page=${page}`);
    return response.data;
  }

  /**
   * Get a specific report by ID
   * @param {string} id - Report ID
   * @returns {Promise} API response with report details
   */
  async getReport(id) {
    const response = await apiClient.get(`/reports/${id}`);
    return response.data;
  }

  /**
   * Update a report
   * @param {string} id - Report ID
   * @param {Object} updates - The fields to update
   * @returns {Promise} API response
   */
  async updateReport(id, updates) {
    const response = await apiClient.put(`/reports/${id}`, updates);
    return response.data;
  }

  /**
   * Delete a report
   * @param {string} id - Report ID
   * @returns {Promise} API response
   */
  async deleteReport(id) {
    const response = await apiClient.delete(`/reports/${id}`);
    return response.data;
  }

  /**
   * Export a report
   * @param {string} id - Report ID
   * @param {string} format - Export format (pdf, image)
   * @param {Object} options - Export options
   * @returns {Promise} API response with export URL
   */
  async exportReport(id, format = 'pdf', options = {}) {
    const response = await apiClient.post(`/reports/${id}/export`, {
      format,
      ...options
    });
    return response.data;
  }

  /**
   * Share a report with others
   * @param {string} id - Report ID
   * @param {Array<string>} emails - Array of email addresses
   * @param {string} message - Optional message
   * @returns {Promise} API response
   */
  async shareReport(id, emails, message = '') {
    const response = await apiClient.post(`/reports/${id}/share`, {
      emails,
      message,
      permissions: 'view'
    });
    return response.data;
  }

  /**
   * Get drill-down data for a report section
   * @param {string} id - Report ID
   * @param {string} sectionId - Section ID
   * @param {Object} filters - Filter criteria
   * @returns {Promise} API response with drill-down data
   */
  async getDrillDownData(id, sectionId, filters = {}) {
    const response = await apiClient.get(`/reports/${id}/drill-down?sectionId=${sectionId}&filters=${JSON.stringify(filters)}`);
    return response.data;
  }
}

export default new ReportService();