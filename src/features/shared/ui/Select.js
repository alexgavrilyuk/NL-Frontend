// src/features/shared/ui/Select.js

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Select component for dropdown selections
 * Provides different variants, sizes, and states
 */
const Select = forwardRef(({
  id,
  name,
  options = [],
  value,
  onChange,
  onBlur,
  label,
  helperText,
  error,
  disabled = false,
  required = false,
  fullWidth = true,
  placeholder = 'Select an option',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'bg-background-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors appearance-none pr-8';

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

  // Combine classes for select
  const selectClasses = [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    stateClasses[state],
    widthClasses,
    className
  ].join(' ');

  // Helper text and error message
  const textMessage = error || helperText;
  const textColor = error ? 'text-error-500' : 'text-text-tertiary';

  // Generate a unique ID if not provided
  const inputId = id || `select-${name}-${Math.random().toString(36).substr(2, 9)}`;

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

      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {textMessage && (
        <p className={`mt-1 text-sm ${textColor}`}>
          {textMessage}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  label: PropTypes.node,
  helperText: PropTypes.node,
  error: PropTypes.node,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Select;