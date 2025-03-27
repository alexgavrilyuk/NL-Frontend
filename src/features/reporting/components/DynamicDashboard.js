// src/features/reporting/components/DynamicDashboard.js

import React, { useState, useEffect, useRef } from 'react';
import Loading from '../../shared/ui/Loading';
import ErrorState from '../../shared/ui/ErrorState';
import Button from '../../shared/ui/Button';

/**
 * Enhanced component that serves as a sandbox for executing AI-generated code
 * Provides error handling, loading states, and a clean execution environment
 */
const DynamicDashboard = ({ code, data, className = '', onRenderComplete = () => {} }) => {
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const executionTimeoutRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      setError(new Error("Container not ready"));
      setIsRendering(false);
      return;
    }

    // Reset UI state
    setIsRendering(true);
    setError(null);

    if (!code) {
      // If no code is provided, attempt to render static visualizations
      if (data?.visualizations && data.visualizations.length > 0) {
        renderStaticVisualizations();
      } else {
        setError(new Error("No visualization code or data available"));
        setIsRendering(false);
      }
      return;
    }

    const executeCode = async () => {
      try {
        // Clear any previous content
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Set up necessary resources for the AI code
        const setupScript = document.createElement('script');
        setupScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
        document.head.appendChild(setupScript);

        // Set an execution timeout to prevent infinite loops
        const EXECUTION_TIMEOUT = 10000; // 10 seconds

        executionTimeoutRef.current = setTimeout(() => {
          setError(new Error("Execution timeout - the visualization code took too long to run"));
          setIsRendering(false);
        }, EXECUTION_TIMEOUT);

        // Once resources are loaded, execute the code
        setupScript.onload = () => {
          try {
            // Create a safe execution environment
            const sandbox = {
              container: containerRef.current,
              data: data || {},
              document: document,
              Chart: window.Chart, // Make Chart.js available to the AI code
              console: {
                log: (...args) => console.log('AI Code:', ...args),
                error: (...args) => console.error('AI Code Error:', ...args),
                warn: (...args) => console.warn('AI Code Warning:', ...args)
              }
            };

            // Execute the code in the sandbox
            const executeFunction = new Function(...Object.keys(sandbox), code);
            executeFunction(...Object.values(sandbox));

            // Clear the timeout as execution completed successfully
            if (executionTimeoutRef.current) {
              clearTimeout(executionTimeoutRef.current);
              executionTimeoutRef.current = null;
            }

            // Report successful rendering
            setIsRendering(false);
            onRenderComplete(true);
          } catch (err) {
            console.error('Error executing AI code:', err);
            setError(err);
            setIsRendering(false);
            onRenderComplete(false, err);

            // Attempt to fall back to static visualizations if available
            if (data?.visualizations && data.visualizations.length > 0) {
              renderStaticVisualizations();
            }
          }
        };

        setupScript.onerror = () => {
          setError(new Error("Failed to load required visualization libraries"));
          setIsRendering(false);
          onRenderComplete(false, new Error("Failed to load required libraries"));
        };
      } catch (err) {
        console.error('Error setting up execution environment:', err);
        setError(err);
        setIsRendering(false);
        onRenderComplete(false, err);
      }
    };

    // Render static visualizations as a fallback
    const renderStaticVisualizations = () => {
      if (!containerRef.current) return;

      try {
        // Create a static representation of the visualizations
        containerRef.current.innerHTML = `
          <div class="static-visualizations p-lg">
            <h2 class="text-xl font-semibold mb-md">Visualizations</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
              ${data.visualizations.map((viz, i) => `
                <div class="viz-container border border-border-light rounded-lg p-md">
                  <h3 class="text-lg font-medium mb-sm">${viz.title || `Visualization ${i+1}`}</h3>
                  ${viz.description ? `<p class="text-text-secondary mb-md">${viz.description}</p>` : ''}
                  <div class="static-viz-placeholder h-64 bg-background-secondary flex items-center justify-center">
                    <p class="text-text-tertiary">Interactive visualization could not be rendered</p>
                  </div>
                </div>
              `).join('')}
            </div>

            ${data.insights && data.insights.length > 0 ? `
              <h2 class="text-xl font-semibold mt-xl mb-md">Insights</h2>
              <div class="insights-container">
                ${data.insights.map((insight, i) => `
                  <div class="insight-item border border-border-light rounded-lg p-md mb-md">
                    <h3 class="text-lg font-medium mb-sm">${insight.title || `Insight ${i+1}`}</h3>
                    <p>${insight.content || ''}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;

        setIsRendering(false);
        onRenderComplete(true);
      } catch (err) {
        console.error('Error rendering static visualizations:', err);
        setError(err);
        setIsRendering(false);
        onRenderComplete(false, err);
      }
    };

    // Execute code after a brief delay to ensure DOM is ready
    const timer = setTimeout(() => {
      executeCode();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);

      // Clear execution timeout if it exists
      if (executionTimeoutRef.current) {
        clearTimeout(executionTimeoutRef.current);
        executionTimeoutRef.current = null;
      }

      // Remove any scripts we added
      const setupScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"]');
      if (setupScript) {
        document.head.removeChild(setupScript);
      }

      // Clean up container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [code, data, onRenderComplete]);

  // Handle retrying execution
  const handleRetry = () => {
    // Simply reset the state, which will trigger the useEffect again
    setIsRendering(true);
    setError(null);
  };

  return (
    <div className={`dynamic-dashboard ${className}`}>
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-primary bg-opacity-80 z-10">
          <Loading text="Rendering dashboard..." />
        </div>
      )}

      {error && (
        <div className="p-lg">
          <ErrorState
            title="Error Rendering Dashboard"
            description={error.message || "An unexpected error occurred while rendering the dashboard."}
            action={
              <Button variant="primary" onClick={handleRetry}>Retry</Button>
            }
          />
        </div>
      )}

      {/* This div serves as the canvas for the AI-generated code */}
      <div
        ref={containerRef}
        className="ai-execution-container min-h-[400px] relative p-lg"
      />
    </div>
  );
};

export default DynamicDashboard;