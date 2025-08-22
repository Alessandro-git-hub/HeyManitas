import React from 'react';

// Default empty state icon - a clean, modern empty folder/document icon
const DefaultIcon = () => (
  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
    />
  </svg>
);

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  showButton = true 
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="text-gray-400 mb-4">
        {icon || <DefaultIcon />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {showButton && buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
