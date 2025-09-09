import React from 'react';

/**
 * Reusable stat card component for dashboard statistics
 * Provides consistent styling for all stat cards
 */
const StatCard = ({ 
  title, 
  value, 
  onClick, 
  clickable = false, 
  subtitle,
  className = '' 
}) => {
  const baseClasses = "bg-primary-700 p-6 rounded-2xl shadow-lg border border-secondary-600 hover:shadow-xl transition-all duration-300 flex flex-col text-center relative overflow-hidden";
  const clickableClasses = clickable ? "cursor-pointer hover:border-primary-300 group" : "";
  const finalClasses = `${baseClasses} ${clickableClasses} ${className}`.trim();

  return (
    <div 
      onClick={onClick}
      className={finalClasses}
    >
      <div className="relative z-1">
        <p className="text-sm text-white mb-2">{title}</p>
        <p className="text-2xl font-bold text-secondary-600">{value}</p>
        {subtitle && (
          <p className="text-xs text-secondary-600 mt-1 group-hover:translate-x-1 transition-transform duration-200">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
