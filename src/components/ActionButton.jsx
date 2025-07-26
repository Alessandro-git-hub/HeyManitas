import React from 'react';

export default function ActionButton({ 
  onClick, 
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  disabled = false,
  type = 'button'
}) {
  // Base styles that are common to all variants
  const baseStyles = 'text-white rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles with consistent color schemes
  const variantStyles = {
    primary: 'bg-blue-800 hover:bg-blue-900',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    success: 'bg-emerald-600 hover:bg-emerald-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
    danger: 'bg-red-600 hover:bg-red-700'
  };
  
  // Size styles
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}
