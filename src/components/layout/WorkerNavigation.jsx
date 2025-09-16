import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileNavigationMenu from './MobileNavigationMenu';

export default function WorkerNavigation({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items configuration
  const navItems = [
    { label: 'Dashboard', path: '/worker', key: 'dashboard' },
    { label: 'Jobs & Bookings', path: '/worker/jobs', key: 'jobs' },
    { label: 'Services', path: '/worker/services', key: 'services' },
    { label: 'Quotes', path: '/worker/quotes', key: 'quotes' },
    { label: 'Clients', path: '/worker/clients', key: 'clients' },
    { label: 'Settings', path: '/worker/settings', key: 'settings' }
  ];

  // Check if current path matches nav item path
  const isActive = (path) => {
    if (path === '/worker') {
      return location.pathname === '/worker';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="mb-8 hidden lg:block overflow-x-auto scrollbar-hide">
        <div className="flex space-x-6 lg:space-x-8 min-w-max lg:min-w-0 px-1 lg:px-0">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`whitespace-nowrap transition-colors cursor-pointer py-2 ${
                isActive(item.path)
                  ? 'text-primary-800 border-b-2 border-secondary-600 font-semibold'
                  : 'text-gray-500 hover:text-primary-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <MobileNavigationMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onNavigate={handleNavigation}
        menuTitle="Worker Navigation"
        navigationItems={navItems}
        isActive={isActive}
      />
    </>
  );
}
