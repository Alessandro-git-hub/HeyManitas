import React from 'react';
import Modal from './Modal';
import ActionButton from './ActionButton';
import LoadingSpinner from './LoadingSpinner';

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
 * @param {boolean} noPadding - Remove default padding from content area (default: false)
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
  noPadding = false,
  footerClassName = '',
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
    <div className={`flex flex-col sm:flex-row gap-3 sm:justify-end bg-white`}>
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
            <LoadingSpinner />
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
      noPadding={noPadding}
      footerClassName={footerClassName}
      className={className}
      footer={footer}
    >
      <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
        {children}
      </form>
    </Modal>
  );
}
