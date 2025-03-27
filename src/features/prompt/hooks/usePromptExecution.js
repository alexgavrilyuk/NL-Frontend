// src/features/prompt/hooks/usePromptExecution.js

import { useState, useEffect, useCallback } from 'react';
import { PROMPT_STATES } from '../components/ProcessingIndicator';
import promptService from '../services/promptService';
import usePolling from './usePolling';

/**
 * Hook for managing prompt execution flow
 * Simplified to focus on getting and executing the AI's code
 */
const usePromptExecution = () => {
  const [state, setState] = useState(PROMPT_STATES.IDLE);
  const [promptId, setPromptId] = useState(null);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Polling hook for prompt status
  const {
    data: statusData,
    error: pollingError,
    startPolling,
    stopPolling
  } = usePolling({
    pollingFn: () => promptId ? promptService.getPrompt(promptId) : Promise.reject('No promptId'),
    interval: 2000,
    maxAttempts: 30,
    condition: data => ['completed', 'generated', 'failed'].includes(data.data.status),
  });

  // Reset the execution state
  const reset = useCallback(() => {
    setState(PROMPT_STATES.IDLE);
    setPromptId(null);
    setError(null);
    setResults(null);
    setProgressPercentage(0);
    stopPolling();
  }, [stopPolling]);

  // Create a new prompt
  const createPrompt = useCallback(async ({ prompt, datasetIds, settings }) => {
    try {
      setState(PROMPT_STATES.CREATING);
      setError(null);
      setResults(null);
      setProgressPercentage(5);

      const response = await promptService.createPrompt(prompt, datasetIds, settings);
      setPromptId(response.data.promptId);

      setState(PROMPT_STATES.PROCESSING);
      setProgressPercentage(15);

      // Start polling for status
      startPolling();

      return response.data.promptId;
    } catch (error) {
      console.error('Error creating prompt:', error);
      setError(error.message || 'Failed to create prompt');
      setState(PROMPT_STATES.FAILED);
      setProgressPercentage(0);
      throw error;
    }
  }, [startPolling]);

  // Execute the prompt when ready
  const executePrompt = useCallback(async () => {
    if (state !== PROMPT_STATES.READY_FOR_EXECUTION || !promptId) {
      return;
    }

    try {
      setState(PROMPT_STATES.EXECUTING);
      setProgressPercentage(60);

      await promptService.executePrompt(promptId);

      // Start polling for execution results
      startPolling();
    } catch (error) {
      console.error('Error executing prompt:', error);
      setError(error.message || 'Failed to execute prompt');
      setState(PROMPT_STATES.FAILED);
      setProgressPercentage(0);
    }
  }, [state, promptId, startPolling]);

  // Get final results
  const getResults = useCallback(async () => {
    if (!promptId) return;

    try {
      setProgressPercentage(85);

      const resultsResponse = await promptService.getPromptResults(promptId);

      // Just use the results directly - no complex processing
      setResults(resultsResponse.data);
      setProgressPercentage(100);
      setState(PROMPT_STATES.COMPLETED);

      return resultsResponse.data;
    } catch (error) {
      console.error('Error getting results:', error);
      setError(error.message || 'Failed to get results');
      setState(PROMPT_STATES.FAILED);
      setProgressPercentage(0);
      throw error;
    }
  }, [promptId]);

  // Handle status changes from polling
  useEffect(() => {
    if (!statusData) return;

    const status = statusData.data.status;

    if (status === 'generated') {
      setState(PROMPT_STATES.READY_FOR_EXECUTION);
      setProgressPercentage(40);
      stopPolling();
    } else if (status === 'completed') {
      setProgressPercentage(80);
      getResults();
      stopPolling();
    } else if (status === 'failed') {
      setError(statusData.data.error?.message || 'Prompt processing failed');
      setState(PROMPT_STATES.FAILED);
      setProgressPercentage(0);
      stopPolling();
    }
  }, [statusData, getResults, stopPolling]);

  // Handle polling errors
  useEffect(() => {
    if (pollingError) {
      setError(pollingError.message || 'Error while checking prompt status');
      setState(PROMPT_STATES.FAILED);
      setProgressPercentage(0);
    }
  }, [pollingError]);

  return {
    state,
    promptId,
    error,
    results,
    progressPercentage,
    createPrompt,
    executePrompt,
    getResults,
    reset,
    // For convenience in the context provider
    setError,
    setState,
    setPromptId,
    setResults,
    setProgressPercentage,
    startPolling,
    stopPolling
  };
};

export default usePromptExecution;