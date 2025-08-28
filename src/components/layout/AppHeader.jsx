import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AppHeader({ userType = 'customer', showPublicNav = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false); // Close menu after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  // Get user's display name, fallback to email or 'User'
  const firstName = user?.firstName || user?.email?.split('@')[0] || 'User';

  // Color and text classes based on userType
  const welcomeTextClass = userType === 'customer'
    ? 'text-primary-600'
    : 'text-gray-600';
  const nameTextClass = userType === 'customer'
    ? 'text-primary-600 md:hidden'
    : 'text-gray-600 md:hidden';
  const logoutBtnClass = userType === 'customer'
    ? 'text-xs md:text-sm text-primary-600 hover:text-secondary-700 flex-shrink-0 cursor-pointer'
    : 'text-xs md:text-sm text-gray-500 hover:text-gray-700 flex-shrink-0 cursor-pointer';

  // Render public navigation for unauthenticated users
  const renderPublicNav = () => (
    <>
      <nav className="hidden lg:flex items-center space-x-8 font-accessible">
        <button 
          onClick={() => handleNavigation('/services')}
          className="text-primary-800 hover:text-secondary-700 font-medium transition-colors cursor-pointer"
        >
          Browse Services
        </button>
        <button 
          onClick={() => handleNavigation('/how-it-works')}
          className="text-primary-800 hover:text-secondary-700 font-medium transition-colors cursor-pointer"
        >
          How It Works
        </button>
        <button 
          onClick={() => handleNavigation('/login?userType=worker')}
          className="text-primary-800 hover:text-secondary-700 font-medium transition-colors cursor-pointer"
        >
          HeyManitas for Workers
        </button>
      </nav>
      
      <div className="hidden lg:flex items-center space-x-4 font-ui">
        <button 
          onClick={() => handleNavigation('/login?userType=customer')}
          className="text-primary-800 hover:text-secondary-700 font-medium transition-colors cursor-pointer"
        >
          Sign In
        </button>
        <button 
          onClick={() => handleNavigation('/signup?userType=customer')}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </>
  );  // Render authenticated user section
  const renderAuthenticatedNav = () => (
    <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
      <span className={`text-xs md:text-sm ${welcomeTextClass} hidden md:inline`}>Welcome back, {firstName}</span>
      <span className={`text-xs md:text-sm ${nameTextClass}`}>{firstName}</span>
      <button 
        onClick={handleLogout}
        className={logoutBtnClass}
      >
        Logout
      </button>
    </div>
  );

  return (
    <header ref={menuRef} className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex justify-between items-center gap-1 md:gap-4">
          {/* Mobile: Hamburger Menu (left) */}
          {showPublicNav && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors order-1"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          {/* Logo - centered on mobile, left on desktop */}
          <button 
            onClick={() => handleNavigation('/')}
            className={`text-xl md:text-2xl font-bold cursor-pointer ${
              showPublicNav ? 'md:order-1 order-2 absolute md:relative left-1/2 md:left-auto transform md:transform-none -translate-x-1/2 md:translate-x-0' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="text-secondary">Hey</span>
              <span className="text-primary">Manitas</span>
            </div>
          </button>
          
          {/* Desktop Navigation & Auth (right side) */}
          <div className="hidden lg:flex items-center space-x-8 order-3">
            {user ? renderAuthenticatedNav() : showPublicNav ? renderPublicNav() : null}
          </div>

          {/* Mobile: Spacer to balance hamburger menu */}
          {showPublicNav && (
            <div className="lg:hidden w-10 order-3"></div>
          )}
        </div>
      </div>

      {/* Mobile Slide-in Menu from Left */}
      {showPublicNav && (
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide-in Menu */}
          <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="text-lg font-bold">
                <span className="text-secondary">Hey</span>
                <span className="text-primary">Manitas</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <nav className="flex flex-col p-4 space-y-6 font-accessible">
              <button 
                onClick={() => handleNavigation('/services')}
                className="text-left text-gray-800 hover:text-primary-600 font-medium transition-colors py-3 text-lg border-b border-gray-100"
              >
                Browse Services
              </button>
              <button 
                onClick={() => handleNavigation('/how-it-works')}
                className="text-left text-gray-800 hover:text-primary-600 font-medium transition-colors py-3 text-lg border-b border-gray-100"
              >
                How It Works
              </button>
              <button 
                onClick={() => handleNavigation('/login?userType=worker')}
                className="text-left text-gray-800 hover:text-primary-600 font-medium transition-colors py-3 text-lg border-b border-gray-100"
              >
                HeyManitas for Workers
              </button>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-4 mt-8 pt-6 border-t border-gray-200 font-ui">
                <button 
                  onClick={() => handleNavigation('/login?userType=customer')}
                  className="text-left text-gray-800 hover:text-primary-600 font-medium transition-colors py-3 text-lg"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleNavigation('/signup?userType=customer')}
                  className="bg-primary-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center text-lg"
                >
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
