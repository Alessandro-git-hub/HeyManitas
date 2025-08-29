import React from 'react';

export default function ActionButton({ 
  onClick, 
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  disabled = false,
  type = 'button',
  form,
  ...props
}) {
  // Base styles that are common to all variants
  const baseStyles = 'rounded-md transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles with consistent color schemes that match the app
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'text-gray-600 border border-gray-300 bg-white hover:bg-gray-50',
    'danger-outline': 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200',
    'success-outline': 'text-green-600 bg-green-50 hover:bg-green-100 border border-green-200'
  };
  
  // Size styles
  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
    modal: 'px-6 py-2' // Perfect for modal buttons
  };
  
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      form={form}
      {...props}
    >
      {children}
    </button>
  );
}
