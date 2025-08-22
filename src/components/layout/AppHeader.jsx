import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AppHeader({ userType = 'customer' }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex justify-between items-center gap-2 md:gap-4">
          <button 
            onClick={() => navigate('/')}
            className="text-xl md:text-2xl font-bold cursor-pointer"
          >
            <div className="flex items-center">
              <span className="text-secondary">Hey</span>
              <span className="text-primary">Manitas</span>
            </div>
          </button>
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
        </div>
      </div>
    </header>
  );
}
