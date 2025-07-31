import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { SERVICE_CATEGORIES } from '../utils/serviceCategories';

const CustomerServices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Convert SERVICE_CATEGORIES object to array format
  const categoryArray = Object.keys(SERVICE_CATEGORIES).map(key => ({
    id: key.toLowerCase().replace(/\s+/g, '-'),
    name: key,
    ...SERVICE_CATEGORIES[key]
  }));

  // Color mapping for category backgrounds
  const colorMap = {
    blue: '#3B82F6',
    yellow: '#EAB308',
    green: '#10B981',
    orange: '#F97316',
    purple: '#8B5CF6',
    pink: '#EC4899',
    emerald: '#10B981',
    red: '#EF4444',
    cyan: '#06B6D4',
    amber: '#F59E0B',
    gray: '#6B7280'
  };

  const filteredCategories = categoryArray.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceSelect = (category) => {
    navigate(`/customer/professionals/${category.id}`, { 
      state: { categoryName: category.name } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Find Services</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            What service do you need?
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for services (e.g., plumbing, electrical, cleaning...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleServiceSelect(category)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl mr-4"
                    style={{ backgroundColor: colorMap[category.color] || colorMap.gray }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {category.name}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Available professionals
                  </span>
                  <button 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Professionals →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No services found
            </h3>
            <p className="text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>

      {/* Popular Services Section */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Popular This Week
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryArray.slice(0, 4).map((category) => (
              <button
                key={category.id}
                onClick={() => handleServiceSelect(category)}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg mb-2"
                  style={{ backgroundColor: colorMap[category.color] || colorMap.gray }}
                >
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServices;
