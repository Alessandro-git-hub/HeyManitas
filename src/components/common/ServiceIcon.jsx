import React from 'react';
import { getCategoryInfo } from '../../utils/serviceCategories';

/**
 * Service Icon Component
 * 
 * Renders service category icons with consistent styling
 */
const ServiceIcon = ({ 
  category, 
  className = "text-secondary-600",
  size = "w-5 h-5" 
}) => {
  const categoryInfo = getCategoryInfo(category);
  const IconComponent = categoryInfo.icon;
  
  return (
    <div className={className}>
      {React.cloneElement(IconComponent(), { 
        className: size 
      })}
    </div>
  );
};

export default ServiceIcon;