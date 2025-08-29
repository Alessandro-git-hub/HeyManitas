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
                <path d="M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z"/>
            </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
