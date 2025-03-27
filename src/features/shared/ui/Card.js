// src/features/shared/ui/Card.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for containing content in a boxed UI element
 */
const Card = ({
  children,
  title,
  subtitle,
  footer,
  headerActions,
  variant = 'default',
  elevation = 'md',
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'bg-background-primary rounded-lg overflow-hidden transition-shadow';

  // Variant styles
  const variantClasses = {
    default: 'border border-border-light',
    outline: 'border border-border-normal',
    filled: 'bg-background-secondary',
  };

  // Elevation styles
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  // Combine classes
  const cardClasses = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    elevationClasses[elevation] || elevationClasses.md,
    className
  ].join(' ');

  const hasHeader = title || subtitle || headerActions;

  return (
    <div className={cardClasses} {...props}>
      {hasHeader && (
        <div className="px-md pt-md pb-sm flex justify-between items-start border-b border-border-light">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-text-primary">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {headerActions && (
            <div className="ml-auto">
              {headerActions}
            </div>
          )}
        </div>
      )}

      <div className="px-md py-md">
        {children}
      </div>

      {footer && (
        <div className="px-md py-sm border-t border-border-light bg-background-secondary">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  footer: PropTypes.node,
  headerActions: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'outline', 'filled']),
  elevation: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Card;