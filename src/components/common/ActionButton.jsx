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
  const baseStyles = 'rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles with consistent color schemes
  const variantStyles = {
    primary: 'bg-blue-800 hover:bg-blue-900 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'text-gray-600 border border-gray-300 bg-white hover:bg-gray-50'
  };
  
  // Size styles
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
    'modal': 'px-6 py-2' // Perfect for modal buttons
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
