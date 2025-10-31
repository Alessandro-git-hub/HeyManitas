import React from 'react';

export default function EmptyState({ 
  title, 
  description
}) {
  return (
    <div className="bg-primary-700 rounded-lg p-8 text-center border border-secondary-600">
      <h3 className="text-lg font-medium text-secondary-600 mb-2">{title}</h3>
      <p className="text-white mb-4">{description}</p>
    </div>
  );
}
