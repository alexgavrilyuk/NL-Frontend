// src/features/shared/ui/EmptyState.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * EmptyState component for displaying when no data is available
 */
const EmptyState = ({
  title,
  description,
  icon,
  action,
  compact = false,
  className = '',
  ...props
}) => {
  // Default icon if none provided
  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-lg ${compact ? 'py-md' : 'py-xl'} ${className}`}
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
      {description && (
        <p className="text-text-secondary max-w-md mb-md">
          {description}
        </p>
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

EmptyState.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  icon: PropTypes.node,
  action: PropTypes.node,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

export default EmptyState;