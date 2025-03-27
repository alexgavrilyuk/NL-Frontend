// src/features/prompt/context/PromptContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import promptService from '../services/promptService';
import usePromptExecution from '../hooks/usePromptExecution';
import { PROMPT_STATES } from '../components/ProcessingIndicator';

// Create context
const PromptContext = createContext();

export const PromptProvider = ({ children }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    visualizationType: 'auto',
    includeInsights: true,
    language: 'en',
    displayCurrency: 'USD',
    fiscalYearStart: 'January'
  });
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  // Use our custom prompt execution hook
  const promptExecution = usePromptExecution();

  // Load prompts on mount
  useEffect(() => {
    loadPrompts();
  }, []);

  // Function to load prompts from API
  const loadPrompts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await promptService.getPrompts();
      setPrompts(response.data.prompts);
    } catch (err) {
      console.error('Error loading prompts:', err);
      setError(err.message || 'Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  // Select a prompt by ID
  const selectPrompt = useCallback(async (id) => {
    if (id === selectedPromptId) return;

    try {
      setSelectedPromptId(id);
      setLoading(true);

      // Reset execution state
      promptExecution.reset();

      // Load prompt details
      const response = await promptService.getPrompt(id);

      // Handle different prompt states
      const promptStatus = response.data.status;

      if (promptStatus === 'completed' && response.data.results) {
        // If prompt is already completed, set results
        promptExecution.setState(PROMPT_STATES.COMPLETED);
        promptExecution.setResults(response.data.results);
      } else if (promptStatus === 'failed') {
        // If prompt failed, set error
        promptExecution.setState(PROMPT_STATES.FAILED);
        promptExecution.setError(response.data.error?.message || 'Prompt processing failed');
      } else if (promptStatus === 'generated') {
        // If prompt is ready for execution
        promptExecution.setState(PROMPT_STATES.READY_FOR_EXECUTION);
        promptExecution.setPromptId(id);
      } else {
        // If prompt is still processing
        promptExecution.setState(PROMPT_STATES.PROCESSING);
        promptExecution.setPromptId(id);

        // Start polling for status
        promptExecution.startPolling();
      }
    } catch (err) {
      console.error('Error selecting prompt:', err);
      setError(err.message || 'Failed to load prompt details');
    } finally {
      setLoading(false);
    }
  }, [selectedPromptId, promptExecution]);

  // Create a new prompt
  const createNewPrompt = useCallback(async ({ prompt, datasetIds }) => {
    try {
      // Use the execution hook to create prompt
      const promptId = await promptExecution.createPrompt({
        prompt,
        datasetIds,
        settings
      });

      // Add to prompt list
      const newPrompt = {
        id: promptId,
        prompt,
        status: 'created',
        created: new Date().toISOString(),
        datasetIds,
        hasResults: false,
        hasError: false,
      };

      setPrompts(prev => [newPrompt, ...prev]);
      setSelectedPromptId(promptId);

      return promptId;
    } catch (err) {
      console.error('Error creating new prompt:', err);
      throw err;
    }
  }, [promptExecution, settings]);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Update the prompts list when a prompt status changes
  useEffect(() => {
    if (promptExecution.promptId && promptExecution.state !== 'idle') {
      setPrompts(prev =>
        prev.map(p =>
          p.id === promptExecution.promptId
            ? {
                ...p,
                status: promptExecution.state === 'COMPLETED' ? 'completed' :
                        promptExecution.state === 'FAILED' ? 'failed' :
                        'processing',
                hasResults: promptExecution.state === 'COMPLETED',
                hasError: promptExecution.state === 'FAILED'
              }
            : p
        )
      );
    }
  }, [promptExecution.promptId, promptExecution.state]);

  // Context value
  const value = {
    prompts,
    loading,
    error,
    settings,
    selectedPromptId,
    execution: promptExecution,
    loadPrompts,
    selectPrompt,
    createNewPrompt,
    updateSettings,
  };

  return (
    <PromptContext.Provider value={value}>
      {children}
    </PromptContext.Provider>
  );
};

// Custom hook for using the prompt context
export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};

export default PromptContext;