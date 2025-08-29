import React from 'react';
import Button from './Button';

export default function GetStartedButton({ onClick, variant = 'desktop', className = '' }) {
  return (
    <Button 
      onClick={onClick}
      variant={variant}
      type="primary"
      className={className}
    >
      Get Started
    </Button>
  );
}
