import React from 'react';
import Button from './Button';

export default function SignInButton({ onClick, variant = 'desktop', className = '' }) {
  return (
    <Button 
      onClick={onClick}
      variant={variant}
      type="secondary"
      className={className}
    >
      Sign In
    </Button>
  );
}
