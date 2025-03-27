// src/features/shared/ui/Input.js

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component for form controls
 * Provides different variants, sizes, and states
 */
const Input = forwardRef(({
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  fullWidth = true,
  prefix,
  suffix,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'bg-background-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors';

  // Size styles
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-md py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  };

  // Disabled, error, and other states
  const stateClasses = {
    normal: 'border-border-normal',
    disabled: 'opacity-60 bg-background-secondary cursor-not-allowed',
    error: 'border-error-500 focus:ring-error-500',
  };

  // Width control
  const widthClasses = fullWidth ? 'w-full' : '';

  // Determine state
  const state = disabled ? 'disabled' : error ? 'error' : 'normal';

  // Combine classes for input
  const inputClasses = [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    stateClasses[state],
    widthClasses,
    prefix ? 'rounded-l-none' : '',
    suffix ? 'rounded-r-none' : '',
    className
  ].join(' ');

  // Helper text and error message
  const textMessage = error || helperText;
  const textColor = error ? 'text-error-500' : 'text-text-tertiary';

  // Generate a unique ID if not provided
  const inputId = id || `input-${name}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary mb-1"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className={`relative flex ${fullWidth ? 'w-full' : ''}`}>
        {prefix && (
          <div className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border-normal bg-background-secondary text-text-tertiary">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />

        {suffix && (
          <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-border-normal bg-background-secondary text-text-tertiary">
            {suffix}
          </div>
        )}
      </div>

      {textMessage && (
        <p className={`mt-1 text-sm ${textColor}`}>
          {textMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  label: PropTypes.node,
  helperText: PropTypes.node,
  error: PropTypes.node,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Input;