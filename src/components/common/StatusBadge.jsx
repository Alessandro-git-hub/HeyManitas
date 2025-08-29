import React from 'react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  upcoming: 'bg-primary-50 text-primary-600 border-primary-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200'
};

export default function StatusBadge({ 
  status, 
  size = 'medium',
  className = '' 
}) {
  const sizeStyles = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const baseStyles = 'inline-flex items-center rounded-full border font-medium';
  const statusStyle = statusStyles[status?.toLowerCase()] || statusStyles.pending;
  const sizeStyle = sizeStyles[size];

  return (
    <span className={`${baseStyles} ${statusStyle} ${sizeStyle} ${className}`.trim()}>
      {status}
    </span>
  );
}
