// src/features/prompt/components/PromptHistory.js

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/ui/Card';
import Badge from '../../shared/ui/Badge';

const PromptHistory = ({ prompts, currentPromptId, onSelectPrompt, isLoading }) => {
  if (isLoading) {
    return (
      <Card title="Recent Prompts" className="h-full animate-pulse">
        <div className="space-y-sm">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-sm border border-border-light rounded-md">
              <div className="h-4 bg-background-tertiary rounded w-3/4 mb-sm"></div>
              <div className="h-3 bg-background-tertiary rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (prompts.length === 0) {
    return (
      <Card title="Recent Prompts" className="h-full">
        <div className="text-center py-md text-text-secondary">
          <p className="mb-sm">No previous prompts</p>
          <p className="text-sm">Your prompt history will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Prompts" className="h-full">
      <div className="space-y-sm max-h-80 overflow-y-auto pr-sm">
        {prompts.map(prompt => (
          <div
            key={prompt.id}
            className={`
              p-sm border rounded-md cursor-pointer transition-colors
              ${prompt.id === currentPromptId
                ? 'border-primary-500 bg-primary-50'
                : 'border-border-light hover:border-primary-300 hover:bg-background-secondary'}
            `}
            onClick={() => onSelectPrompt(prompt.id)}
          >
            <div className="flex justify-between items-start mb-sm">
              <h4 className="font-medium text-md truncate mr-sm">{prompt.prompt.substring(0, 40)}{prompt.prompt.length > 40 ? '...' : ''}</h4>
              <StatusBadge status={prompt.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-tertiary">
                {new Date(prompt.created).toLocaleDateString()}
              </span>
              {prompt.hasResults && (
                <Link
                  to={`/reports/${prompt.id}`}
                  className="text-sm text-primary-500 hover:text-primary-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Report
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success" size="sm">Completed</Badge>;
    case 'processing':
    case 'executing':
    case 'created':
      return <Badge variant="info" size="sm">Processing</Badge>;
    case 'failed':
      return <Badge variant="error" size="sm">Failed</Badge>;
    default:
      return <Badge variant="default" size="sm">{status}</Badge>;
  }
};

export default PromptHistory;