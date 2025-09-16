import React from 'react';
import { useHeader } from '../../hooks/useHeader';
import Icon from '../common/Icon';
import Logo from '../common/Logo';
import { DesktopNavigation } from './Navigation';
import { DesktopAuthButtons } from './AuthButtons';
import MobileMenu from './MobileMenu';

export default function AppHeader({ 
  showPublicNav = false,
  showWorkerNav = false,
  toggleWorkerMobileMenu
}) {
  const {
    user,
    firstName,
    isMobileMenuOpen,
    handleLogout,
    handleNavigation,
    toggleMobileMenu,
    closeMobileMenu
  } = useHeader();

  // Determine which mobile menu to use - now unified through useHeader hook
  const mobileMenuOpen = isMobileMenuOpen;
  const toggleMobileMenuHandler = showWorkerNav 
    ? toggleWorkerMobileMenu
    : toggleMobileMenu;

  return (
    <header 
      id="header-menu" 
      className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-primary-700 fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="grid grid-cols-3 items-center">
          {/* LEFT SECTION */}
          <div className="flex items-center justify-start">
            {/* Desktop: Logo */}
            <div className="hidden lg:block">
              <Logo onClick={() => handleNavigation('/')} variant="desktop" />
            </div>
            
            {/* Mobile: Hamburger Menu (unified for both public and worker nav) */}
            {(showPublicNav || showWorkerNav) && (
              <button
                onClick={toggleMobileMenuHandler}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Toggle menu"
              >
                <Icon name={mobileMenuOpen ? "close" : "menu"} size={24} />
              </button>
            )}
          </div>

          {/* CENTER SECTION */}
          <div className="flex items-center justify-center">
            {/* Mobile: Logo */}
            <div className="lg:hidden">
              <Logo onClick={() => handleNavigation('/')} variant="mobile" />
            </div>

            {/* Desktop: Navigation */}
            {showPublicNav && (
              <DesktopNavigation onNavigate={handleNavigation} />
            )}

            {/* Authenticated users - center welcome message */}
            {user && !showPublicNav && (
              <span className="text-sm text-primary-600 hidden lg:inline">
                Welcome back, {firstName}
              </span>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center justify-end">
            {/* Desktop: Auth buttons or logout */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-sm text-primary-600">{firstName}</span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-primary-600 hover:text-secondary-700 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : showPublicNav ? (
              <DesktopAuthButtons onNavigate={handleNavigation} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onNavigate={handleNavigation}
        showPublicNav={showPublicNav}
      />
    </header>
  );
}
