// src/features/shared/ui/Button.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component for user interactions
 * Provides different variants, sizes, and states
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  onClick,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant styles
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-background-secondary hover:bg-background-tertiary text-text-primary border border-border-normal focus:ring-primary-500',
    outline: 'bg-transparent hover:bg-background-secondary text-primary-500 border border-primary-500 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-background-secondary text-text-primary focus:ring-primary-500',
    danger: 'bg-error-500 hover:bg-error-700 text-white focus:ring-error-500',
    success: 'bg-success-500 hover:bg-success-700 text-white focus:ring-success-500',
  };

  // Size styles
  const sizeClasses = {
    xs: 'text-xs py-1 px-2',
    sm: 'text-sm py-1.5 px-3',
    md: 'text-md py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
    xl: 'text-xl py-3 px-6',
  };

  // Disabled and loading styles
  const stateClasses = {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'relative !text-transparent transition-none hover:!text-transparent',
  };

  // Width control
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine classes
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    disabled ? stateClasses.disabled : '',
    loading ? stateClasses.loading : '',
    widthClasses,
    className
  ].join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {leftIcon && (
        <span className={`mr-2 inline-flex ${loading ? 'opacity-0' : ''}`}>
          {leftIcon}
        </span>
      )}

      {children}

      {rightIcon && (
        <span className={`ml-2 inline-flex ${loading ? 'opacity-0' : ''}`}>
          {rightIcon}
        </span>
      )}

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;