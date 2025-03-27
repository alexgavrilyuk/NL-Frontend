// src/features/shared/ui/Modal.js

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Modal component for displaying content in a dialog
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  hideCloseButton = false,
  className = '',
  ...props
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Auto-focus the first focusable element
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // Size Classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-md',
  };

  const modalSizeClass = sizeClasses[size] || sizeClasses.md;

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-gray-900 bg-opacity-50 p-md overflow-y-auto"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      {...props}
    >
      <div
        ref={modalRef}
        className={`w-full ${modalSizeClass} bg-background-primary rounded-lg shadow-xl transform transition-all ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(title || !hideCloseButton) && (
          <div className="flex justify-between items-center border-b border-border-light p-md">
            {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}

            {!hideCloseButton && (
              <button
                type="button"
                className="text-text-tertiary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="p-md">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="border-t border-border-light p-md bg-background-secondary">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnOverlayClick: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;