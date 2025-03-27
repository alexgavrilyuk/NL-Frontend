// src/features/datasets/context/DatasetContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import datasetService from '../services/datasetService';

// Create context
const DatasetContext = createContext();

export const DatasetProvider = ({ children }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [includeIgnored, setIncludeIgnored] = useState(false);

  // Load datasets
  const loadDatasets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await datasetService.getDatasets(filter, includeIgnored);
      setDatasets(response.data.datasets);
    } catch (err) {
      console.error('Error loading datasets:', err);
      setError(err.message || 'Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when filter changes
  useEffect(() => {
    loadDatasets();
  }, [filter, includeIgnored]);

  // Upload a dataset
  const uploadDataset = async (file, name, description, metadata) => {
    try {
      const response = await datasetService.uploadDataset(file, name, description, metadata);

      // Update the datasets list with the new dataset
      setDatasets(prevDatasets => [response.data.dataset, ...prevDatasets]);

      return response.data.dataset;
    } catch (err) {
      console.error('Error uploading dataset:', err);
      throw err;
    }
  };

  // Delete a dataset
  const deleteDataset = async (id) => {
    try {
      await datasetService.deleteDataset(id);

      // Remove the dataset from the list
      setDatasets(prevDatasets => prevDatasets.filter(dataset => dataset.id !== id));
    } catch (err) {
      console.error('Error deleting dataset:', err);
      throw err;
    }
  };

  // Update a dataset
  const updateDataset = async (id, updates) => {
    try {
      const response = await datasetService.updateDataset(id, updates);

      // Update the dataset in the list
      setDatasets(prevDatasets => prevDatasets.map(dataset =>
        dataset.id === id ? response.data.dataset : dataset
      ));

      return response.data.dataset;
    } catch (err) {
      console.error('Error updating dataset:', err);
      throw err;
    }
  };

  // Update dataset schema
  const updateDatasetSchema = async (id, columns) => {
    try {
      const response = await datasetService.updateDatasetSchema(id, columns);

      // Update the dataset in the list
      setDatasets(prevDatasets => prevDatasets.map(dataset =>
        dataset.id === id ? {
          ...dataset,
          schema: response.data.schema
        } : dataset
      ));

      return response.data.schema;
    } catch (err) {
      console.error('Error updating dataset schema:', err);
      throw err;
    }
  };

  // Set dataset filter
  const setDatasetFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // Toggle including ignored datasets
  const toggleIncludeIgnored = () => {
    setIncludeIgnored(prev => !prev);
  };

  // Context value
  const value = {
    datasets,
    loading,
    error,
    filter,
    includeIgnored,
    uploadDataset,
    deleteDataset,
    updateDataset,
    updateDatasetSchema,
    setDatasetFilter,
    toggleIncludeIgnored,
    refreshDatasets: loadDatasets
  };

  return (
    <DatasetContext.Provider value={value}>
      {children}
    </DatasetContext.Provider>
  );
};

// Custom hook for using the dataset context
export const useDatasets = () => {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error('useDatasets must be used within a DatasetProvider');
  }
  return context;
};

export default DatasetContext;