import React from 'react';

const navigationItems = [
  { label: 'Browse Services', path: '/services' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'HeyManitas for Workers', path: '/login?userType=worker' }
];

export function DesktopNavigation({ onNavigate }) {
  return (
    <nav className="hidden lg:flex items-center space-x-8 font-accessible">
      {navigationItems.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          className="text-primary-800 hover:text-secondary-700 font-medium transition-colors cursor-pointer"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export function MobileNavigation({ onNavigate }) {
  return (
    <div className="flex flex-col p-4 space-y-6 font-accessible bg-white h-full overflow-y-auto">
      {navigationItems.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate(item.path)}
          className="text-left text-gray-800 hover:text-primary-600 font-medium transition-colors py-3 text-lg border-b border-gray-100"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
