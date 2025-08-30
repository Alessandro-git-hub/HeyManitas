import React from 'react';
import Icon from '../common/Icon';

const ServiceSearchSection = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="rounded-2xl p-6 mb-8 shadow-lg relative z-1 border border-[#f4dfb8]" style={{ backgroundColor: '#6F4E37' }}>
      <h2 className="text-xl font-semibold text-white mb-4 text-center">
        What service do you need?
      </h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for services"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-white placeholder-neutral-3300 w-full px-6 py-4 border border-white rounded-full focus:outline-none focus:border-white text-lg shadow-sm"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary-600 hover:bg-secondary-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer">
          <Icon name="search" size={24} />
        </div>
      </div>
    </div>
  );
};

export default ServiceSearchSection;
