// src/features/prompt/pages/PromptPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import Input from '../../shared/ui/Input';
import Loading from '../../shared/ui/Loading';
import Alert from '../../shared/ui/Alert';
import { usePrompt } from '../context/PromptContext';
import { useDatasets } from '../../datasets/context/DatasetContext';

const PromptPage = () => {
  const navigate = useNavigate();
  const { datasets, loading: datasetsLoading } = useDatasets();
  const {
    createPrompt,
    executePrompt,
    getResults,
    promptId,
    state,
    progressPercentage,
    results
  } = usePrompt();

  const [prompt, setPrompt] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null); // Added the missing error state
  const [success, setSuccess] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt) {
      setError('Please enter a prompt to analyze your data');
      return;
    }

    if (selectedDatasets.length === 0) {
      setError('Please select at least one dataset');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create and process the prompt
      await createPrompt(prompt, selectedDatasets);
      setSuccess('Prompt created successfully! Processing your request...');
    } catch (err) {
      setError(err.message || 'Failed to create prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dataset selection handler
  const handleDatasetSelection = (datasetId) => {
    setSelectedDatasets(prev => {
      if (prev.includes(datasetId)) {
        return prev.filter(id => id !== datasetId);
      } else {
        return [...prev, datasetId];
      }
    });
  };

  // Execute prompt when ready
  useEffect(() => {
    const executePromptWhenReady = async () => {
      if (state === 'ready_for_execution' && promptId) {
        try {
          await executePrompt();
        } catch (err) {
          setError(err.message || 'Failed to execute prompt');
        }
      }
    };

    executePromptWhenReady();
  }, [state, promptId, executePrompt]);

  // Get results when execution completes
  useEffect(() => {
    const fetchResultsWhenReady = async () => {
      if (state === 'completed' && promptId) {
        try {
          await getResults();
          navigate(`/reports/new?promptId=${promptId}`);
        } catch (err) {
          setError(err.message || 'Failed to get results');
        }
      }
    };

    fetchResultsWhenReady();
  }, [state, promptId, getResults, navigate]);

  if (datasetsLoading) {
    return <Loading fullPage text="Loading datasets..." />;
  }

  return (
    <div className="container mx-auto px-md py-lg">
      <PageHeader
        title="Create Analysis"
        subtitle="Enter a prompt and select datasets to generate insights"
      />

      {error && (
        <Alert
          variant="error"
          className="mb-lg"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          className="mb-lg"
        >
          {success}
        </Alert>
      )}

      <Card className="mb-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-md">
            <h3 className="text-lg font-semibold mb-md">What would you like to analyze?</h3>
            <Input
              type="text"
              placeholder="E.g., Show me monthly sales trends by region with insights on seasonal patterns"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isSubmitting || state !== 'idle'}
            />
            <p className="text-text-secondary text-sm mt-sm">
              Be specific about what you want to see. You can ask for specific visualizations,
              time periods, and data comparisons.
            </p>
          </div>

          <div className="p-md border-t border-border-light">
            <h3 className="text-lg font-semibold mb-md">Select Datasets</h3>

            {datasets.length === 0 ? (
              <div className="text-center py-lg">
                <p className="text-text-secondary mb-md">You don't have any datasets yet.</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/datasets/new')}
                >
                  Upload Dataset
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {datasets.map(dataset => (
                  <div
                    key={dataset.id}
                    className={`border rounded-md p-md cursor-pointer hover:bg-background-secondary transition-colors
                      ${selectedDatasets.includes(dataset.id) ? 'border-primary-500 bg-primary-50' : 'border-border-light'}
                    `}
                    onClick={() => handleDatasetSelection(dataset.id)}
                  >
                    <h4 className="font-medium">{dataset.name}</h4>
                    {dataset.description && (
                      <p className="text-text-secondary text-sm mt-1">{dataset.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-md border-t border-border-light flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || state !== 'idle'}
              disabled={isSubmitting || state !== 'idle' || datasets.length === 0}
            >
              Generate Analysis
            </Button>
          </div>
        </form>
      </Card>

      {state !== 'idle' && state !== 'failed' && (
        <Card className="mb-lg">
          <div className="p-md">
            <h3 className="text-lg font-semibold mb-md">Processing</h3>
            <div className="w-full bg-background-secondary rounded-full h-4 mb-md">
              <div
                className="bg-primary-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-text-secondary">
              {state === 'creating' && 'Creating your analysis...'}
              {state === 'processing' && 'Processing your data...'}
              {state === 'ready_for_execution' && 'Ready to execute analysis...'}
              {state === 'executing' && 'Executing analysis...'}
              {state === 'completed' && 'Analysis complete. Redirecting...'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PromptPage;