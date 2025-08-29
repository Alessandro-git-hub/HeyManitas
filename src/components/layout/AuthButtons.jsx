import React from 'react';
import Button from '../common/Button';

export function DesktopAuthButtons({ onNavigate }) {
  return (
    <div className="hidden lg:flex items-center space-x-4 font-ui">
      <Button 
        onClick={() => onNavigate('/login?userType=customer')}
        variant="desktop"
        type="secondary"
      >
        Sign In
      </Button>
      <Button 
        onClick={() => onNavigate('/signup?userType=customer')}
        variant="desktop"
        type="primary"
      >
        Get Started
      </Button>
    </div>
  );
}

export function MobileAuthButtons({ onNavigate }) {
  return (
    <div className="flex flex-col space-y-4 mt-8 pt-6 border-t border-gray-200 font-ui">
      <Button 
        onClick={() => onNavigate('/login?userType=customer')}
        variant="mobile"
        type="secondary"
      >
        Sign In
      </Button>
      <Button 
        onClick={() => onNavigate('/signup?userType=customer')}
        variant="mobile"
        type="primary"
      >
        Get Started
      </Button>
    </div>
  );
}
