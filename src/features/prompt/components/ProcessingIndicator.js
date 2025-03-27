// src/features/prompt/components/ProcessingIndicator.js

import React from 'react';
import Card from '../../shared/ui/Card';

// States for the prompt execution flow
const PROMPT_STATES = {
  IDLE: 'idle',
  CREATING: 'creating',
  PROCESSING: 'processing',
  READY_FOR_EXECUTION: 'ready_for_execution',
  EXECUTING: 'executing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

const ProcessingIndicator = ({ state, progress, error }) => {
  // If not processing, don't render anything
  if (state === PROMPT_STATES.IDLE || state === PROMPT_STATES.COMPLETED) {
    return null;
  }

  // Define steps in the process
  const steps = [
    { id: 'creating', label: 'Creating prompt', state: PROMPT_STATES.CREATING },
    { id: 'processing', label: 'Analyzing data', state: PROMPT_STATES.PROCESSING },
    { id: 'generating', label: 'Generating insights', state: PROMPT_STATES.READY_FOR_EXECUTION },
    { id: 'executing', label: 'Building visualizations', state: PROMPT_STATES.EXECUTING },
  ];

  // Determine current step
  const getCurrentStepIndex = () => {
    const stateToIndex = {
      [PROMPT_STATES.CREATING]: 0,
      [PROMPT_STATES.PROCESSING]: 1,
      [PROMPT_STATES.READY_FOR_EXECUTION]: 2,
      [PROMPT_STATES.EXECUTING]: 3,
    };
    return stateToIndex[state] || 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  // If failed, show error state
  if (state === PROMPT_STATES.FAILED) {
    return (
      <Card
        title="Processing Error"
        className="mb-lg border-error-500"
      >
        <div className="text-error-700">
          <p className="font-medium">We encountered an error while processing your request:</p>
          <p className="mt-sm">{error || "An unknown error occurred. Please try again."}</p>
          <div className="mt-md">
            <p className="text-sm">Suggestions:</p>
            <ul className="list-disc list-inside text-sm ml-sm mt-sm">
              <li>Try simplifying your prompt</li>
              <li>Check if your datasets contain the requested information</li>
              <li>Select different datasets that may be more relevant</li>
              <li>Try again in a few moments</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Processing Your Request"
      className="mb-lg"
    >
      {/* Progress bar */}
      <div className="mb-md">
        <div className="h-2 w-full bg-background-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="grid grid-cols-4 gap-sm">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`text-center ${index <= currentStepIndex ? 'text-primary-700' : 'text-text-tertiary'}`}
          >
            <div className="flex justify-center mb-sm">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-colors
                ${index < currentStepIndex ? 'bg-primary-500 text-white' :
                  index === currentStepIndex ? 'bg-primary-100 text-primary-700 border border-primary-500' :
                  'bg-background-tertiary text-text-tertiary'}
              `}>
                {index < currentStepIndex ? (
                  <CheckIcon />
                ) : (
                  <span className="text-sm">{index + 1}</span>
                )}
              </div>
            </div>
            <p className="text-sm">
              {step.label}
              {index === currentStepIndex && <span className="blinking-dots">...</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Helpful messaging */}
      <div className="mt-lg text-center text-text-secondary text-sm">
        <p>This may take a moment. We're analyzing your data and generating insights...</p>
      </div>
    </Card>
  );
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

// Add some CSS in the component style section
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes blink {
    0% { opacity: 0.2; }
    20% { opacity: 1; }
    100% { opacity: 0.2; }
  }

  .blinking-dots::after {
    content: '';
    animation: blink 1.4s infinite both;
  }
`;
document.head.appendChild(styleSheet);

export default ProcessingIndicator;
export { PROMPT_STATES };