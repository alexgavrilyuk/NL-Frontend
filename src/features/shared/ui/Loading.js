// src/features/shared/ui/Loading.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading component for indicating loading states
 */
const Loading = ({
  size = 'md',
  variant = 'spinner',
  text = 'Loading...',
  overlay = false,
  fullPage = false,
  className = '',
  ...props
}) => {
  // Size classes for spinner and dots
  const sizeClasses = {
    xs: {
      spinner: 'h-4 w-4',
      dots: 'h-1 w-1',
      text: 'text-xs'
    },
    sm: {
      spinner: 'h-5 w-5',
      dots: 'h-1.5 w-1.5',
      text: 'text-sm'
    },
    md: {
      spinner: 'h-8 w-8',
      dots: 'h-2 w-2',
      text: 'text-md'
    },
    lg: {
      spinner: 'h-12 w-12',
      dots: 'h-2.5 w-2.5',
      text: 'text-lg'
    },
    xl: {
      spinner: 'h-16 w-16',
      dots: 'h-3 w-3',
      text: 'text-xl'
    },
  };

  // Get size classes based on size prop
  const currentSize = sizeClasses[size] || sizeClasses.md;

  // Loading variants
  const loadingVariant = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`animate-spin rounded-full border-t-2 border-r-2 border-primary-500 ${currentSize.spinner}`}></div>
        );
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className={`rounded-full bg-primary-500 ${currentSize.dots}`}
                style={{
                  animation: `pulse 1.2s ease-in-out ${dot * 0.2}s infinite`
                }}
              ></div>
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className={`relative ${currentSize.spinner}`}>
            <div className="absolute inset-0 rounded-full bg-primary-500 opacity-25 animate-ping"></div>
            <div className="relative rounded-full bg-primary-500 h-full w-full opacity-75"></div>
          </div>
        );
      default:
        return (
          <div className={`animate-spin rounded-full border-t-2 border-r-2 border-primary-500 ${currentSize.spinner}`}></div>
        );
    }
  };

  // Component wrapper classes
  const wrapperClasses = [
    'flex flex-col items-center justify-center',
    overlay || fullPage ? 'z-50' : '',
    fullPage ? 'fixed inset-0 bg-background-primary bg-opacity-80' : '',
    overlay ? 'absolute inset-0 bg-background-primary bg-opacity-60' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} role="status" aria-live="polite" {...props}>
      {loadingVariant()}

      {text && (
        <p className={`mt-md text-text-secondary ${currentSize.text}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Add keyframes for dots animation in global CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);

Loading.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['spinner', 'dots', 'pulse']),
  text: PropTypes.node,
  overlay: PropTypes.bool,
  fullPage: PropTypes.bool,
  className: PropTypes.string,
};

export default Loading;