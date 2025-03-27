// src/features/reporting/components/DynamicDashboard.js

import React, { useState, useEffect, useRef } from 'react';
import Loading from '../../shared/ui/Loading';
import ErrorState from '../../shared/ui/ErrorState';

/**
 * Simple container component that serves as a canvas for executing AI-generated code
 * The AI code will handle all visualization rendering, layout, and insights
 */
const DynamicDashboard = ({ code, data, className = '' }) => {
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!code || !containerRef.current) {
      setError(new Error("No code provided or container not ready"));
      setIsRendering(false);
      return;
    }

    const executeCode = async () => {
      try {
        // Create a safe execution environment
        const sandbox = {
          container: containerRef.current,
          data: data || {},
          document: document,
          console: {
            log: (...args) => console.log('AI Code:', ...args),
            error: (...args) => console.error('AI Code Error:', ...args),
            warn: (...args) => console.warn('AI Code Warning:', ...args)
          },
          // Add any libraries the AI might need
          // These would normally be injected into the sandbox
          // For example: d3, recharts, etc.
        };

        // Execute the code in the sandbox
        // In a real implementation, this would use a proper sandbox like iframe
        const executeFunction = new Function(...Object.keys(sandbox), code);
        executeFunction(...Object.values(sandbox));

        setIsRendering(false);
      } catch (err) {
        console.error('Error executing AI code:', err);
        setError(err);
        setIsRendering(false);
      }
    };

    // Execute the code with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      executeCode();
    }, 100);

    return () => {
      clearTimeout(timer);
      // Clean up any DOM elements or event listeners created by the AI code
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [code, data]);

  if (error) {
    return (
      <ErrorState
        title="Error Rendering Dashboard"
        description={error.message || "An unexpected error occurred while rendering the dashboard."}
        action={<button className="px-md py-sm bg-primary-500 text-white rounded-md" onClick={() => window.location.reload()}>Reload Page</button>}
      />
    );
  }

  return (
    <div className={`dynamic-dashboard ${className}`}>
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-primary bg-opacity-80 z-10">
          <Loading text="Generating dashboard..." />
        </div>
      )}

      {/* This div serves as the canvas for the AI-generated code */}
      <div
        ref={containerRef}
        className="ai-execution-container min-h-[300px] relative"
      />
    </div>
  );
};

export default DynamicDashboard;