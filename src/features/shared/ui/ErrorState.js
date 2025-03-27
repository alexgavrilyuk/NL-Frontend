// src/features/shared/ui/ErrorState.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorState component for displaying error states
 */
const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error while processing your request.',
  code,
  details,
  icon,
  action,
  compact = false,
  className = '',
  ...props
}) => {
  // Default error icon if none provided
  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-lg ${compact ? 'py-md' : 'py-xl'} ${className}`}
      role="alert"
      {...props}
    >
      {/* Icon */}
      <div className="mb-md">
        {icon || defaultIcon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-primary mb-sm">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary max-w-md mb-md">
        {description}
      </p>

      {/* Error Code */}
      {code && (
        <div className="inline-block px-md py-sm bg-background-secondary rounded-md text-text-tertiary text-sm mb-md">
          Error Code: {code}
        </div>
      )}

      {/* Error Details (collapsible) */}
      {details && (
        <details className="mb-md max-w-lg w-full">
          <summary className="cursor-pointer text-sm text-text-tertiary hover:text-text-secondary mb-sm p-sm">
            Technical Details
          </summary>
          <div className="text-left p-sm bg-background-tertiary rounded-md text-sm font-mono text-text-secondary overflow-auto max-h-48">
            {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
          </div>
        </details>
      )}

      {/* Action Button */}
      {action && (
        <div className="mt-md">
          {action}
        </div>
      )}
    </div>
  );
};

ErrorState.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  details: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.node,
  action: PropTypes.node,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

export default ErrorState;