// src/features/prompt/hooks/usePolling.js

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for polling an API at regular intervals
 * @param {Object} options - Polling options
 * @param {Function} options.pollingFn - Function to call for polling (should return a Promise)
 * @param {number} options.interval - Polling interval in ms (default: 2000)
 * @param {number} options.maxAttempts - Maximum polling attempts (default: 30)
 * @param {Function} options.condition - Function to check if polling should stop (default: null)
 * @returns {Object} Polling state and control functions
 */
const usePolling = ({
  pollingFn,
  interval = 2000,
  maxAttempts = 30,
  condition = null,
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Use refs to handle closure issues in async functions
  const attemptsRef = useRef(0);
  const pollingRef = useRef(false);
  const timeoutRef = useRef(null);
  const conditionRef = useRef(condition);
  const pollingFnRef = useRef(pollingFn);

  // Update refs when props change
  useEffect(() => {
    conditionRef.current = condition;
    pollingFnRef.current = pollingFn;
  }, [condition, pollingFn]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Function to do a single poll
  const doPoll = useCallback(async () => {
    if (!pollingRef.current) return;

    try {
      // Check if max attempts reached
      if (attemptsRef.current >= maxAttempts) {
        setError(new Error('Polling timeout - maximum attempts reached'));
        setPolling(false);
        pollingRef.current = false;
        return;
      }

      // Make request
      const result = await pollingFnRef.current();

      // Update state with result
      setData(result);
      setError(null);

      // Check condition to determine if polling should continue
      const shouldContinue = conditionRef.current ? !conditionRef.current(result) : true;

      if (shouldContinue) {
        // Increment attempt counter
        attemptsRef.current += 1;
        setAttempts(attemptsRef.current);

        // Schedule next poll
        timeoutRef.current = setTimeout(doPoll, interval);
      } else {
        // Condition met, stop polling
        setPolling(false);
        pollingRef.current = false;
      }
    } catch (error) {
      console.error('Polling error:', error);
      setError(error);
      setPolling(false);
      pollingRef.current = false;
    }
  }, [interval, maxAttempts]);

  // Start polling
  const startPolling = useCallback(() => {
    // Reset state
    setData(null);
    setError(null);
    setAttempts(0);
    attemptsRef.current = 0;

    // Start polling
    setLoading(true);
    setPolling(true);
    pollingRef.current = true;

    // Immediate first poll
    doPoll();
  }, [doPoll]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setPolling(false);
    pollingRef.current = false;
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    polling,
    attempts,
    startPolling,
    stopPolling
  };
};

export default usePolling;