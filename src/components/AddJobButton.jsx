import React from 'react';
import ActionButton from './ActionButton';

export default function AddJobButton({ 
  onClick, 
  variant = 'primary',
  size = 'medium',
  text = 'Add New Job',
  className = '',
  disabled = false 
}) {
  return (
    <ActionButton
      onClick={onClick}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
    >
      {text}
    </ActionButton>
  );
}
