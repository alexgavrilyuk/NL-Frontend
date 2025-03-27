// src/features/shared/ui/PageHeader.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * PageHeader component for consistent page headers
 */
const PageHeader = ({
  title,
  subtitle,
  backLink,
  actions,
  breadcrumbs,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-lg ${className}`} {...props}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="mb-md">
          {breadcrumbs}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex items-center">
          {/* Back Link */}
          {backLink && (
            <div className="mr-md">
              {backLink}
            </div>
          )}

          {/* Title and Subtitle */}
          <div>
            <h1 className="text-xxl font-bold text-text-primary">{title}</h1>

            {subtitle && (
              <p className="mt-1 text-md text-text-secondary">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="mt-md md:mt-0 flex flex-wrap items-center gap-sm">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  backLink: PropTypes.node,
  actions: PropTypes.node,
  breadcrumbs: PropTypes.node,
  className: PropTypes.string,
};

export default PageHeader;