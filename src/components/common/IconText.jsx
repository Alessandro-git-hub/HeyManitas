import React from 'react';

export default function IconText({ 
  icon: Icon, 
  children, 
  className = '',
  iconClassName = 'text-gray-400',
  textClassName = 'text-gray-600',
  size = 'medium'
}) {
  const sizeStyles = {
    small: 'text-xs',
    medium: 'text-sm', 
    large: 'text-base'
  };

  const iconSizes = {
    small: 'mr-1',
    medium: 'mr-2',
    large: 'mr-3'
  };

  return (
    <div className={`flex items-center ${sizeStyles[size]} ${className}`}>
      {Icon && <Icon className={`${iconSizes[size]} ${iconClassName}`} />}
      <span className={textClassName}>{children}</span>
    </div>
  );
}
