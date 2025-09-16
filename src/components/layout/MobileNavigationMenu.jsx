import React from 'react';
import Icon from '../common/Icon';
import Logo from '../common/Logo';

export default function MobileNavigationMenu({ 
  isOpen, 
  onClose, 
  onNavigate, 
  menuTitle = "Navigation",
  navigationItems = [],
  showLogo = false,
  isActive = () => false
}) {
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
          {showLogo ? (
            <Logo onClick={() => onNavigate?.('/')} variant="mobile" />
          ) : (
            <h3 className="text-lg font-semibold text-primary-700">{menuTitle}</h3>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Close menu"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Menu Content */}
        <nav className="py-4">
          {navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate?.(item.path)}
              className={`w-full text-left px-6 py-4 transition-colors border-b border-gray-100 last:border-b-0 ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-800 font-semibold border-l-4 border-l-secondary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
