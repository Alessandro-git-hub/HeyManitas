import React from 'react';
import ServiceIcon from '../common/ServiceIcon';

export default function ServiceCard({ 
  service, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  showActions = true 
}) {

  return (
    <div className="bg-primary-700 p-6 rounded-2xl shadow-lg border border-secondary-600 hover:shadow-xl group hover:border-primary-300 relative overflow-hidden transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => onEdit && onEdit(service)}>

      {/* Subtle accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-secondary-600 mb-2">
            {service.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium bg-white px-2 py-1 rounded-full" style={{ color: '#6F4E37' }}>
              {service.category}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            service.isActive 
              ? 'bg-secondary-600 text-primary-700' 
              : 'bg-gray-600 text-gray-200'
          }`}>
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-secondary-600 mb-4 leading-relaxed flex-1">
        <span className='text-white font-bold'>Description:</span> {service.description}
      </p>

      {/* Pricing Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-white font-bold">Base Price:</span>
          <span className="font-medium text-secondary-600">€{service.basePrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white font-bold">Duration:</span>
          <span className="font-medium text-secondary-600">{service.duration}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t border-primary-600">
          <button
            onClick={() => onToggleStatus && onToggleStatus(service.id, service.isActive)}
            className={`text-sm px-3 py-1 rounded-full transition-all duration-200 font-medium ${
              service.isActive
                ? 'text-orange-200 hover:bg-orange-500/20 bg-orange-600/20'
                : 'text-green-200 hover:bg-green-500/20 bg-green-600/20'
            }`}
          >
            {service.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => onDelete && onDelete(service.id)}
              className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-primary-600 cursor-pointer"
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
