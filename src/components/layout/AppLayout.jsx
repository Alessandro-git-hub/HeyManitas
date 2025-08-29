import React from 'react';
import AppHeader from './AppHeader';

export default function AppLayout({ children, showPublicNav = false, className = "" }) {
  return (
    <div className={`min-h-screen ${className}`}>
      <AppHeader showPublicNav={showPublicNav} />
      <div className="pt-16 md:pt-20">
        {children}
      </div>
    </div>
  );
}
