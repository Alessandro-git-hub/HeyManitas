import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CustomerNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items configuration
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard', key: 'dashboard' },
    { label: 'Services', path: '/customer/services', key: 'services' },
    { label: 'Calendar', path: '/customer/calendar', key: 'calendar' },
    { label: 'Profile', path: '/customer/profile', key: 'profile' }
  ];

  // Check if current path matches nav item path
  const isActive = (path) => {
    if (path === '/customer/dashboard') {
      return location.pathname === '/customer/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-6 md:space-x-8 min-w-max md:min-w-0 px-1 md:px-0">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              isActive(item.path)
                ? 'text-primary-800 border-b-2 border-secondary-600 font-semibold'
                : 'text-gray-500 hover:text-deep'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
