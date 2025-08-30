import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ServiceSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build search parameters
    const searchParams = new URLSearchParams();
    if (searchQuery.trim()) searchParams.set('q', searchQuery.trim());

    // Navigate to public services page with search parameters
    navigate(`/services?${searchParams.toString()}`);
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl max-w-full">
      <div className="w-full max-w-4xl mx-auto">

        <form onSubmit={handleSearch} className="space-y-4 font-ui w-full">
          {/* Search Bar with Integrated Button */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white w-full px-6 py-4 pr-16 text-lg border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 font-ui shadow-sm transition-colors max-w-full"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary-600 hover:bg-secondary-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>  
          </div>
        </form>
      </div>
    </div>
  );
}
