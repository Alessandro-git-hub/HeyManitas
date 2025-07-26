import React from 'react';
import { getCategoryInfo, getCategoryStyles } from '../../utils/serviceCategories';

export default function ServiceCard({ 
  service, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  showActions = true 
}) {
  const categoryInfo = getCategoryInfo(service.category);
  const categoryStyles = getCategoryStyles(service.category);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {service.name}
          </h3>
          <div className={`text-sm px-3 py-1 rounded-full border inline-flex items-center gap-2 ${categoryStyles}`}>
            <span className="text-base">{categoryInfo.icon}</span>
            <span className="font-medium">{service.category}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            service.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {service.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Base Price:</span>
          <span className="font-medium text-gray-900">€{service.basePrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Duration:</span>
          <span className="font-medium text-gray-900">{service.duration}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus && onToggleStatus(service.id)}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              service.isActive
                ? 'text-orange-600 hover:bg-orange-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {service.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit && onEdit(service)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Edit service"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete && onDelete(service.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Delete service"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
