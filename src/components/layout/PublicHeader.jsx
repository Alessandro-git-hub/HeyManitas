import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PublicHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="text-2xl font-bold cursor-pointer"
          >
            <div className="flex items-center">
              <span className="text-secondary">Hey</span>
              <span className="text-primary">Manitas</span>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/services')}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Browse Services
            </button>
            <button 
              onClick={() => navigate('/how-it-works')}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => navigate('/login?userType=worker')}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              HeyManitas for Workers
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/login?userType=customer')}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup?userType=customer')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 hover:text-primary-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
