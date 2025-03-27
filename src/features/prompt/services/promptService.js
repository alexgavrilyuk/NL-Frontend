// src/features/prompt/services/promptService.js

import apiClient from '../../shared/api/apiClient';

class PromptService {
  /**
   * Create a new AI prompt for analysis
   * @param {string} prompt - The user's natural language prompt
   * @param {Array<string>} datasetIds - Array of dataset IDs to analyze
   * @param {Object} settings - Optional settings for the analysis
   * @returns {Promise} API response
   */
  async createPrompt(prompt, datasetIds, settings = {}) {
    const response = await apiClient.post('/prompts', {
      prompt,
      datasetIds,
      settings
    });
    return response.data;
  }

  /**
   * Get a list of all user prompts
   * @param {number} limit - Number of prompts to return
   * @param {number} page - Page number for pagination
   * @returns {Promise} API response with prompts list
   */
  async getPrompts(limit = 10, page = 1) {
    const response = await apiClient.get(`/prompts?limit=${limit}&page=${page}`);
    return response.data;
  }

  /**
   * Get a specific prompt by ID
   * @param {string} id - Prompt ID
   * @returns {Promise} API response with prompt details
   */
  async getPrompt(id) {
    const response = await apiClient.get(`/prompts/${id}`);
    return response.data;
  }

  /**
   * Execute code for a specific prompt
   * @param {string} id - Prompt ID
   * @param {Object} executionOptions - Options for execution
   * @returns {Promise} API response
   */
  async executePrompt(id, executionOptions = {}) {
    const response = await apiClient.post(`/prompts/${id}/execute`, {
      executionOptions
    });
    return response.data;
  }

  /**
   * Get execution results for a prompt
   * @param {string} id - Prompt ID
   * @returns {Promise} API response with execution results
   */
  async getPromptResults(id) {
    const response = await apiClient.get(`/prompts/${id}/results`);
    return response.data;
  }
}

export default new PromptService();