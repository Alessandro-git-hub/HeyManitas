import React from 'react';
import ServiceCategoryCard from './ServiceCategoryCard';

const ServicesGrid = ({ categories, onServiceSelect }) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      {/* All Services Section Header */}
      <div className="mb-6 relative z-1">
        <h3 className="text-2xl font-bold text-primary-700 text-center">
          All Services
        </h3>
      </div>

      {/* Service Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-1">
        {categories.map((category) => (
          <ServiceCategoryCard
            key={category.id}
            category={category}
            onSelect={onServiceSelect}
          />
        ))}
      </div>
    </>
  );
};

export default ServicesGrid;
