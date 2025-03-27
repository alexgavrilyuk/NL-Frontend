// src/features/prompt/pages/PromptPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../context/PromptContext';
import PageHeader from '../../shared/ui/PageHeader';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import PromptInput from '../components/PromptInput';
import PromptHistory from '../components/PromptHistory';
import ProcessingIndicator, { PROMPT_STATES } from '../components/ProcessingIndicator';
import PromptContextSettings from '../components/PromptContextSettings';
import DynamicDashboard from '../../reporting/components/DynamicDashboard';

const PromptPage = () => {
  const navigate = useNavigate();
  const {
    prompts,
    loading,
    error,
    settings,
    selectedPromptId,
    execution,
    loadPrompts,
    selectPrompt,
    createNewPrompt,
    updateSettings
  } = usePrompt();

  // Keep track of whether to show results or input
  const [showResults, setShowResults] = useState(false);

  // Handle form submission
  const handleSubmitPrompt = async (promptData) => {
    try {
      await createNewPrompt(promptData);
      setShowResults(true);
    } catch (err) {
      console.error('Error submitting prompt:', err);
      // Error handling is managed by the context
    }
  };

  // Handle prompt selection from history
  const handleSelectPrompt = (promptId) => {
    selectPrompt(promptId);
    setShowResults(true);
  };

  // New prompt button action
  const handleNewPrompt = () => {
    execution.reset();
    setShowResults(false);
  };

  // Handle continue to execute button
  const handleExecutePrompt = () => {
    execution.executePrompt();
  };

  // Handle save as report button
  const handleSaveReport = () => {
    if (execution.results && execution.promptId) {
      navigate(`/reports/new?promptId=${execution.promptId}`);
    }
  };

  // If execution completes or fails, refresh the prompts list
  useEffect(() => {
    if (execution.state === PROMPT_STATES.COMPLETED || execution.state === PROMPT_STATES.FAILED) {
      loadPrompts();
    }
  }, [execution.state, loadPrompts]);

  return (
    <div className="prompt-page">
      <PageHeader
        title="AI Analysis"
        subtitle="Ask questions about your financial data and get instant insights"
        actions={
          showResults && (
            <Button
              variant="primary"
              onClick={handleNewPrompt}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
            >
              New Analysis
            </Button>
          )
        }
      />

      {error && (
        <Alert
          variant="error"
          className="mb-lg"
          dismissible
          onDismiss={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Processing indicator */}
      <ProcessingIndicator
        state={execution.state}
        progress={execution.progressPercentage}
        error={execution.error}
      />

      {/* Show either results or input form */}
      {showResults ? (
        <div className="results-container">
          {/* Results view */}
          {execution.state === PROMPT_STATES.READY_FOR_EXECUTION && (
            <Card className="mb-lg">
              <div className="p-md text-center">
                <p className="mb-md">Analysis is ready to execute. Click the button below to generate visualizations.</p>
                <Button
                  variant="primary"
                  onClick={handleExecutePrompt}
                  className="mx-auto"
                >
                  Continue to Generate Visualizations
                </Button>
              </div>
            </Card>
          )}

          {/* Results content */}
          {execution.state === PROMPT_STATES.COMPLETED && execution.results && (
            <div className="mb-lg">
              <div className="flex justify-between items-center mb-md">
                <h2 className="text-xl font-semibold">Analysis Results</h2>
                <Button
                  variant="primary"
                  onClick={handleSaveReport}
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                    </svg>
                  }
                >
                  Save as Report
                </Button>
              </div>

              {/* Simple dashboard container for AI-generated code */}
              <DynamicDashboard
                code={execution.results.code}
                data={execution.results.data}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="input-container">
          {/* Prompt input form */}
          <PromptInput
            onSubmit={handleSubmitPrompt}
            isProcessing={execution.state !== PROMPT_STATES.IDLE}
          />
        </div>
      )}

      {/* History and Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mt-lg">
        <PromptHistory
          prompts={prompts}
          currentPromptId={selectedPromptId}
          onSelectPrompt={handleSelectPrompt}
          isLoading={loading}
        />

        <PromptContextSettings
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      </div>
    </div>
  );
};

export default PromptPage;