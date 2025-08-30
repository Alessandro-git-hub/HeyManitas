import React from 'react';
import Icon from '../common/Icon';

const ServiceCategoryCard = ({ category, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(category)}
      className="bg-primary-700 p-6 rounded-2xl shadow-lg border border-secondary-600 hover:shadow-xl cursor-pointer group hover:border-primary-300 relative overflow-hidden transition-all duration-300"
    >
      <div className="relative z-1">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold text-secondary-600">
            {category.name}
          </h3>
        </div>
        <p className="text-white text-sm mb-4 leading-relaxed">
          {category.description}
        </p>
        <div className="flex justify-start">
          <div className="flex items-center text-secondary-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
            View Professionals
          </div>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="absolute bottom-4 right-4 opacity-100">
        <div className="w-10 h-6 rounded-full bg-secondary-600 group-hover:bg-secondary-500 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
          <Icon name="arrowRight" size={16} />
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoryCard;
