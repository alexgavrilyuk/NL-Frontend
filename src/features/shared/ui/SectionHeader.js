// src/features/shared/ui/SectionHeader.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * SectionHeader component for consistent section headers within pages
 */
const SectionHeader = ({
  title,
  subtitle,
  actions,
  divider = true,
  collapsible = false,
  collapsed = false,
  onToggle,
  className = '',
  ...props
}) => {
  return (
    <div className={`${className}`} {...props}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-md">
        <div className="flex items-center">
          {/* Title and toggle icon for collapsible sections */}
          <div className="flex items-center">
            {collapsible && onToggle && (
              <button
                onClick={onToggle}
                className="mr-2 text-text-tertiary hover:text-text-primary focus:outline-none"
                aria-expanded={!collapsed}
                aria-label={collapsed ? 'Expand section' : 'Collapse section'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${collapsed ? '' : 'transform rotate-90'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="ml-md text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="mt-sm sm:mt-0 flex flex-wrap items-center gap-sm">
            {actions}
          </div>
        )}
      </div>

      {/* Divider */}
      {divider && (
        <div className="h-px bg-border-light mb-md"></div>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  divider: PropTypes.bool,
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
};

export default SectionHeader;