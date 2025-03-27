// src/features/shared/ui/Avatar.js

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Avatar component for displaying user profile pictures or initials
 */
const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  variant = 'circle',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-md',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    xxl: 'h-20 w-20 text-xxl',
  };

  // Shape variant
  const variantClasses = {
    circle: 'rounded-full',
    square: 'rounded-md',
  };

  // Status colors
  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
  };

  // Status sizes
  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    xxl: 'h-4 w-4',
  };

  // Generate initials from name
  const getInitials = () => {
    if (!name) return '?';

    const names = name.trim().split(' ');

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  // Apply color based on name
  const getAvatarBgColor = () => {
    if (!name) return 'bg-primary-500';

    const colors = [
      'bg-primary-500',
      'bg-success-500',
      'bg-info-500',
      'bg-warning-500',
      'bg-error-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-green-500',
    ];

    // Generate a consistent color based on name
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = charCodeSum % colors.length;

    return colors[colorIndex];
  };

  // Default classes
  const baseClasses = [
    'inline-flex items-center justify-center',
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.circle,
    !src && getAvatarBgColor(),
    className
  ].join(' ');

  return (
    <div className="relative inline-block" {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`object-cover ${baseClasses}`}
        />
      ) : (
        <div className={`${baseClasses} text-white font-medium`}>
          {getInitials()}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-background-primary ${statusColors[status] || 'bg-gray-400'} ${statusSizes[size] || statusSizes.md}`}
          title={status}
        ></span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  variant: PropTypes.oneOf(['circle', 'square']),
  className: PropTypes.string,
};

export default Avatar;