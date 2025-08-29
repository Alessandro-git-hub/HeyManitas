import React from 'react';

export default function Logo({ onClick, variant = 'desktop' }) {
  const baseClasses = "font-bold cursor-pointer";
  
  const variantClasses = {
    desktop: "text-xl md:text-2xl",
    mobile: "text-xl"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <div className="flex items-center">
        <span className="text-secondary">Hey</span>
        <span className="text-primary">Manitas</span>
      </div>
    </button>
  );
}
