import React, { useEffect } from 'react';

/**
 * Base Modal Component
 * 
 * A reusable modal foundation that handles:
 * - Overlay/backdrop behavior
 * - Close functionality (click outside, ESC key)
 * - Consistent styling and animations
 * - Accessibility features
 * 
 * Props:
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {string} title - Modal title (optional)
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl', 'full' (default: 'md')
 * @param {boolean} closeOnEscape - Enable ESC key to close (default: true)
 * @param {boolean} closeOnOverlay - Enable click outside to close (default: true)
 * @param {boolean} preventClose - Prevent closing during operations (default: false)
 * @param {string} className - Additional CSS classes for modal content
 * @param {boolean} noPadding - Remove default padding from content area (default: false)
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Optional footer content
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnEscape = true,
  closeOnOverlay = true,
  preventClose = false,
  className = '',
  noPadding = false,
  footerClassName = '',
  children,
  footer
}) {
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && closeOnEscape && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, closeOnEscape, preventClose, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  // Size configuration - responsive width: full on mobile, fit-content on desktop
  const sizeClasses = {
    sm: 'w-full md:w-fit max-w-sm',
    md: 'w-full md:w-fit max-w-md', 
    lg: 'w-full md:w-fit max-w-lg',
    xl: 'w-full md:w-fit max-w-2xl',
    '2xl': 'w-full md:w-fit max-w-4xl',
    full: 'w-full max-w-full mx-4'
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay && !preventClose) {
      onClose();
    }
  };

  // Handle close button click
  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleOverlayClick}
      >
        {/* Modal Content */}
        <div 
          className={`
            bg-white rounded-lg shadow-xl max-h-[90vh] md:min-w-[800px] overflow-hidden
            transform transition-all duration-200 ease-out
            ${sizeClasses[size]}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-primary-700 bg-white">
              <h2 id="modal-title" className="text-lg md:text-xl font-semibold text-deep">
                {title}
              </h2>
              <button
                onClick={handleClose}
                disabled={preventClose}
                className={`
                  text-primary-700 cursor-pointer transition-colors
                  ${preventClose ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary-600'}
                `}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="bg-secondary-600 overflow-y-auto max-h-[calc(90vh-8rem)]">
            <div className={noPadding ? "" : "p-4 md:p-6"}>
              {children}
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div className={`p-4 md:p-6 border-t border-primary-700 ${footerClassName || 'bg-white'}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
