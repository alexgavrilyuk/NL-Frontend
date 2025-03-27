// src/features/shared/ui/Tabs.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tabs component for switching between different content sections
 */
const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'border-b border-border-light';

  // Variant styles
  const variantClasses = {
    default: '',
    pills: 'flex space-x-2',
    underline: '',
  };

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
  };

  // Combine classes
  const tabsClasses = [
    baseClasses,
    variantClasses[variant] || '',
    sizeClasses[size] || sizeClasses.md,
    className
  ].join(' ');

  // Tab item styles
  const getTabItemClasses = (tabId) => {
    const isActive = activeTab === tabId;

    const baseItemClasses = 'inline-block cursor-pointer transition-colors';

    // Different styles based on variant
    if (variant === 'pills') {
      return `${baseItemClasses} px-4 py-2 rounded-md ${
        isActive
          ? 'bg-primary-500 text-white'
          : 'bg-background-secondary hover:bg-background-tertiary text-text-primary'
      }`;
    }

    if (variant === 'underline') {
      return `${baseItemClasses} px-4 py-2 ${
        isActive
          ? 'border-b-2 border-primary-500 text-primary-500'
          : 'text-text-secondary hover:text-text-primary'
      }`;
    }

    // Default variant
    return `${baseItemClasses} px-4 py-2 rounded-t-md ${
      isActive
        ? 'bg-background-primary border-t border-l border-r border-border-light -mb-px text-primary-500'
        : 'text-text-secondary hover:text-text-primary'
    }`;
  };

  return (
    <div className={tabsClasses} {...props}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={getTabItemClasses(tab.id)}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['default', 'pills', 'underline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Tabs;