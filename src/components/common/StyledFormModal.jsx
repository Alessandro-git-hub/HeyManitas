import React from 'react';
import FormModal from './FormModal';

/**
 * Styled Form Modal Component
 * 
 * Pre-configured FormModal with consistent styling used across the app
 * Features dark background (secondary-600) with proper padding and styling
 */
const StyledFormModal = ({
  children,
  ...props
}) => {
  return (
    <FormModal
      noPadding={true}
      footerClassName="bg-secondary-600"
      {...props}
    >
      {/* Content with custom background styling */}
      <div className="p-6 bg-secondary-600">
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </FormModal>
  );
};

export default StyledFormModal;