import React from 'react';

export default function Button({ 
  onClick, 
  variant = 'desktop', 
  type = 'primary',
  children,
  className = '' 
}) {
  const baseClasses = "font-medium transition-colors cursor-pointer";
  
  const typeClasses = {
    primary: "bg-primary-600 text-secondary-600 hover:bg-primary-700",
    secondary: "bg-secondary-600 text-primary-700 hover:bg-secondary-700"
  };
  
  const variantClasses = {
    desktop: "px-4 py-2 rounded-3xl text-base",
    mobile: "px-6 py-4 rounded-3xl text-center text-lg"
  };

  const combinedClasses = `${baseClasses} ${typeClasses[type]} ${variantClasses[variant]} ${className}`;

  return (
    <button 
      onClick={onClick}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}
