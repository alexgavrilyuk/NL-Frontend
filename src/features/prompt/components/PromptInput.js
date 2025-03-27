// src/features/prompt/components/PromptInput.js

import React, { useState, useRef, useEffect } from 'react';
import Button from '../../shared/ui/Button';
import { useDatasets } from '../../datasets/context/DatasetContext';

const PromptInput = ({ onSubmit, isProcessing }) => {
  const [promptText, setPromptText] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const { datasets, loading: datasetsLoading } = useDatasets();
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [promptText]);

  const handlePromptChange = (e) => {
    setPromptText(e.target.value);
  };

  const handleDatasetToggle = (datasetId) => {
    setSelectedDatasets(prev =>
      prev.includes(datasetId)
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!promptText.trim()) {
      return;
    }

    if (selectedDatasets.length === 0) {
      // Maybe show a warning that no datasets are selected?
      return;
    }

    onSubmit({
      prompt: promptText.trim(),
      datasetIds: selectedDatasets
    });
  };

  return (
    <div className="prompt-input bg-background-primary rounded-lg border border-border-light shadow-md p-md">
      <form onSubmit={handleSubmit}>
        {/* Prompt Textarea */}
        <div className="mb-md">
          <textarea
            ref={textareaRef}
            value={promptText}
            onChange={handlePromptChange}
            placeholder="Ask about your financial data... e.g., 'Show me sales trends by region with insights on seasonal patterns'"
            className="w-full bg-background-primary border border-border-normal rounded-md p-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            rows={3}
            disabled={isProcessing}
          />
        </div>

        {/* Dataset Selection */}
        <div className="mb-md">
          <h3 className="text-md font-semibold mb-sm">Select datasets to analyze:</h3>
          <div className="dataset-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-sm max-h-40 overflow-y-auto p-sm">
            {datasetsLoading ? (
              <div className="text-text-secondary">Loading datasets...</div>
            ) : datasets.length === 0 ? (
              <div className="text-text-secondary">No datasets available. Please upload datasets first.</div>
            ) : (
              datasets
                .filter(dataset => !dataset.ignored)
                .map(dataset => (
                  <div
                    key={dataset.id}
                    className={`
                      dataset-item flex items-center p-sm rounded-md cursor-pointer transition-colors
                      ${selectedDatasets.includes(dataset.id)
                        ? 'bg-primary-100 border border-primary-300'
                        : 'bg-background-secondary hover:bg-background-tertiary border border-transparent'}
                    `}
                    onClick={() => handleDatasetToggle(dataset.id)}
                  >
                    <input
                      type="checkbox"
                      className="mr-sm"
                      checked={selectedDatasets.includes(dataset.id)}
                      onChange={() => {}}
                      id={`dataset-${dataset.id}`}
                    />
                    <label
                      htmlFor={`dataset-${dataset.id}`}
                      className="flex-1 cursor-pointer truncate"
                    >
                      {dataset.name}
                    </label>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={!promptText.trim() || selectedDatasets.length === 0 || isProcessing}
            loading={isProcessing}
            className="px-lg"
          >
            Generate Analysis
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;