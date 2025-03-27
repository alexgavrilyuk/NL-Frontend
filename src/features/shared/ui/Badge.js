// src/features/shared/ui/Badge.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge component for displaying status, counts, or labels
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  pill = false,
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  // Variant styles
  const variantClasses = {
    default: 'bg-background-tertiary text-text-primary',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    error: 'bg-error-50 text-error-700',
    info: 'bg-info-50 text-info-700',
  };

  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-1',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-0.5',
    lg: 'text-md px-3 py-1',
  };

  // Shape classes
  const shapeClass = pill ? 'rounded-full' : 'rounded-md';

  // Combine classes
  const badgeClasses = [
    'inline-flex items-center font-medium',
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.md,
    shapeClass,
    className
  ].join(' ');

  // Dot styles
  const dotStyle = {
    display: dot ? 'inline-block' : 'none',
    width: size === 'xs' || size === 'sm' ? '6px' : '8px',
    height: size === 'xs' || size === 'sm' ? '6px' : '8px',
    borderRadius: '50%',
    marginRight: '4px',
    backgroundColor: 'currentColor',
  };

  return (
    <span className={badgeClasses} {...props}>
      {dot && <span style={dotStyle}></span>}

      {children}

      {removable && (
        <button
          type="button"
          className="ml-1 hover:bg-background-secondary hover:bg-opacity-25 rounded-full focus:outline-none"
          onClick={onRemove}
          aria-label="Remove badge"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  pill: PropTypes.bool,
  dot: PropTypes.bool,
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
  className: PropTypes.string,
};

export default Badge;