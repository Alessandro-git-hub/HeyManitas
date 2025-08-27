import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../utils/serviceCategories';

export default function ServiceSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');

  const serviceCategories = getAllCategories();

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build search parameters
    const searchParams = new URLSearchParams();
    if (searchQuery.trim()) searchParams.set('q', searchQuery.trim());
    if (selectedCategory) searchParams.set('category', selectedCategory);
    if (location.trim()) searchParams.set('location', location.trim());

    // Navigate to public services page with search parameters
    navigate(`/services?${searchParams.toString()}`);
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl pr-8">
      <div className="max-w-4xl mx-auto">
        {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-left mb-2">
          What service do you need?
        </h2> */}

        <form onSubmit={handleSearch} className="space-y-4 font-ui">
          {/* Search Bar with Integrated Button */}
          <div className="relative">
            <input
              type="text"
              placeholder="What service do you need?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-16 text-lg border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 font-ui shadow-sm transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary-600 hover:bg-secondary-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>

        {/* Quick Category Links */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {serviceCategories.slice(0, 6).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchQuery(category);
                }}
                className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm hover:bg-primary-50 hover:text-primary-600 transition-colors border"
              >
                {category}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
