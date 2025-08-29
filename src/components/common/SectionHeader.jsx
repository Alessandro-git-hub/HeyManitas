import React from 'react';

export default function SectionHeader({ 
  title, 
  subtitle, 
  centered = true,
  className = '',
  titleClassName = '',
  subtitleClassName = ''
}) {
  const containerStyles = centered 
    ? 'text-center mb-12' 
    : 'mb-8';

  return (
    <div className={`${containerStyles} ${className}`}>
      <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${titleClassName}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-xl text-gray-600 ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
