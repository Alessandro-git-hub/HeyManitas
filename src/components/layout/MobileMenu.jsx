import React from 'react';
import Icon from '../common/Icon';
import Logo from '../common/Logo';
import { MobileNavigation } from './Navigation';
import { MobileAuthButtons } from './AuthButtons';

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  onNavigate, 
  showPublicNav 
}) {
  if (!showPublicNav) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
        onClick={onClose}
      />
      
      {/* Slide-in Menu */}
      <div className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Logo onClick={() => onNavigate('/')} variant="mobile" />
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Close menu"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Menu Content */}
        <nav className="font-accessible">
          <MobileNavigation onNavigate={onNavigate} />
          <MobileAuthButtons onNavigate={onNavigate} />
        </nav>
      </div>
    </>
  );
}
