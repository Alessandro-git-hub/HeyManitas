import React from 'react';

/**
 * Reusable container component for dashboard sections
 * Provides consistent beige background styling
 */
export const DashboardContainer = ({ 
  children, 
  className = '', 
  style = {},
  fitContent = false,
  ...props 
}) => {
  const heightClass = fitContent ? 'h-fit' : '';
  
  return (
    <div 
      className={`rounded-2xl p-6 shadow-lg border border-brown relative z-1 ${heightClass} ${className}`}
      style={{ backgroundColor: '#f4dfb8', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Reusable header component for dashboard sections
 * Provides consistent header layout with title and optional action button
 */
export const DashboardSectionHeader = ({ 
  title, 
  actionButton, 
  badge,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h3 className="text-xl font-semibold text-primary-700">{title}</h3>
      <div className="flex items-center space-x-3">
        {badge}
        {actionButton}
      </div>
    </div>
  );
};

/**
 * Reusable card component for items within dashboard sections
 * Provides consistent white card styling
 */
export const DashboardCard = ({ 
  children, 
  onClick,
  className = '',
  hoverable = true,
  ...props 
}) => {
  const hoverClass = hoverable ? 'hover:shadow-md transition-shadow' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-xl p-4 border border-gray-200 ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Reusable empty state component
 * Provides consistent empty state styling
 */
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  className = '',
  compact = false 
}) => {
  const paddingClass = compact ? 'py-4' : 'py-8';
  const iconClass = compact ? 'text-gray-400 text-xl mx-auto mb-2' : 'text-gray-400 text-3xl mx-auto mb-3';
  
  return (
    <div className={`text-center ${paddingClass} ${className}`}>
      {Icon && <Icon className={iconClass} />}
      <p className="text-gray-600">{title}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

/**
 * Reusable loading state component
 * Provides consistent loading spinner
 */
export const LoadingState = ({ className = '', compact = false }) => {
  const paddingClass = compact ? 'py-4' : 'py-8';
  
  return (
    <div className={`flex items-center justify-center ${paddingClass} ${className}`}>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
    </div>
  );
};
