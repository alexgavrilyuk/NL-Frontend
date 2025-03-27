// src/features/datasets/services/datasetService.js

import apiClient from '../../shared/api/apiClient';

class DatasetService {
  async uploadDataset(file, name, description = '', metadata = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    if (description) {
      formData.append('description', description);
    }

    if (Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiClient.post('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  async getDatasets(filter = 'all', includeIgnored = false) {
    const response = await apiClient.get(`/datasets?filter=${filter}&includeIgnored=${includeIgnored}`);
    return response.data;
  }

  async getDataset(id) {
    const response = await apiClient.get(`/datasets/${id}`);
    return response.data;
  }

  async updateDataset(id, updates) {
    const response = await apiClient.put(`/datasets/${id}`, updates);
    return response.data;
  }

  async deleteDataset(id) {
    const response = await apiClient.delete(`/datasets/${id}`);
    return response.data;
  }

  async getDatasetSchema(id) {
    const response = await apiClient.get(`/datasets/${id}/schema`);
    return response.data;
  }

  async updateDatasetSchema(id, columns) {
    const response = await apiClient.put(`/datasets/${id}/schema`, { columns });
    return response.data;
  }

  async getDatasetDownloadUrl(id) {
    const response = await apiClient.get(`/datasets/${id}/download`);
    return response.data;
  }
}

export default new DatasetService();