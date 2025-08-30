import React from 'react';

const PopularServicesSection = ({ categories, onServiceSelect }) => {
  return (
    <div className="mb-8 relative z-1">
      <div className="rounded-2xl p-6 shadow-lg border border-brown" style={{ backgroundColor: '#f4dfb8' }}>
        <h3 className="text-2xl font-bold text-primary-700 mb-6 text-center">
          Popular This Week
        </h3>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <ServiceCategoryButton
              key={category.id}
              category={category}
              onSelect={() => onServiceSelect(category)}
              className="bg-white p-4 rounded-2xl border border-brown transition-all duration-300 flex flex-col items-center group hover:shadow-lg transform hover:scale-105 cursor-pointer"
            />
          ))}
        </div>
        
        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.slice(0, 6).map((category) => (
              <ServiceCategoryButton
                key={category.id}
                category={category}
                onSelect={() => onServiceSelect(category)}
                className="bg-white p-4 rounded-2xl border border-secondary-600 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 flex flex-col items-center group hover:shadow-lg flex-shrink-0 min-w-[120px]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCategoryButton = ({ category, onSelect, className }) => {
  return (
    <button onClick={onSelect} className={className}>
      <span className="text-sm font-bold text-primary-700 transition-colors text-center">
        {category.name}
      </span>
    </button>
  );
};

export default PopularServicesSection;
