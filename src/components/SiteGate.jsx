import React, { useState, useEffect } from 'react';

const SiteGate = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('siteAccess') === 'granted';
    setIsAuthenticated(authenticated);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set your desired password here
    const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD;
    
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem('siteAccess', 'granted');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-secondary">Hey</span>
            <span className="text-3xl font-bold text-primary">Manitas</span>
          </div>
          <p className="text-gray-600">This site is currently in development</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Access Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Password"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Enter Site
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 HeyManitas - Development Version</p>
        </div>
      </div>
    </div>
  );
};

export default SiteGate;
