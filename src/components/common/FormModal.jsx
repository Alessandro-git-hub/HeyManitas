import React from 'react';
import Modal from './Modal';
import ActionButton from './ActionButton';

/**
 * Form Modal Component
 * 
 * A specialized modal for forms that includes:
 * - Form submission handling
 * - Cancel/Submit button layout
 * - Form validation display
 * - Loading states
 * 
 * Props:
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {function} onSubmit - Form submission handler
 * @param {string} title - Modal title
 * @param {string} size - Modal size (default: 'lg')
 * @param {boolean} isSubmitting - Loading state for form submission
 * @param {string} submitLabel - Text for submit button (default: 'Submit')
 * @param {string} cancelLabel - Text for cancel button (default: 'Cancel')
 * @param {string} submitVariant - Submit button variant (default: 'primary')
 * @param {boolean} submitDisabled - Additional submit button disable condition
 * @param {ReactNode} children - Form content
 * @param {string} className - Additional CSS classes
 */
export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  size = 'lg',
  isSubmitting = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  submitVariant = 'primary',
  submitDisabled = false,
  children,
  className = ''
}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitting && !submitDisabled && onSubmit) {
      onSubmit(e);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Footer with form buttons
  const footer = (
    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
      <ActionButton
        type="button"
        variant="outline"
        onClick={handleClose}
        disabled={isSubmitting}
        className="order-2 sm:order-1"
      >
        {cancelLabel}
      </ActionButton>
      <ActionButton
        type="submit"
        variant={submitVariant}
        disabled={isSubmitting || submitDisabled}
        className="order-1 sm:order-2"
        form="modal-form"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          submitLabel
        )}
      </ActionButton>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size={size}
      preventClose={isSubmitting}
      className={className}
      footer={footer}
    >
      <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
        {children}
      </form>
      
      {/* Helper text */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Press ESC to cancel
      </div>
    </Modal>
  );
}
