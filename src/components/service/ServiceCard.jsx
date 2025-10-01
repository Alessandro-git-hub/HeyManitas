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
    <div className="bg-primary-700 p-6 rounded-2xl shadow-lg border border-secondary-600 hover:shadow-xl group hover:border-primary-300 relative overflow-hidden transition-all duration-300 flex flex-col">
      {/* Subtle accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-secondary-600 mb-2">
            {service.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <ServiceIcon category={service.category} />
            <span className="text-sm font-medium text-white bg-primary-600 px-2 py-1 rounded-full">
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
      <p className="text-sm text-white mb-4 leading-relaxed flex-1">
        {service.description}
      </p>

      {/* Pricing Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Base Price:</span>
          <span className="font-bold text-secondary-600">€{service.basePrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Duration:</span>
          <span className="font-medium text-white">{service.duration}</span>
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
              onClick={() => onEdit && onEdit(service)}
              className="text-secondary-600 hover:text-secondary-400 transition-colors p-1 rounded hover:bg-primary-600"
              title="Edit service"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete && onDelete(service.id)}
              className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-primary-600"
              title="Delete service"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Arrow indicator (matching PopularServices) */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-8 h-8 rounded-full bg-secondary-600 group-hover:bg-secondary-500 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="text-primary-700"
          >
            <path d="M16.175 13H5C4.71667 13 4.47917 12.9042 4.2875 12.7125C4.09583 12.5208 4 12.2833 4 12C4 11.7167 4.09583 11.4792 4.2875 11.2875C4.47917 11.0958 4.71667 11 5 11H16.175L11.275 6.09999C11.075 5.89999 10.9792 5.66665 10.9875 5.39999C10.9958 5.13332 11.1 4.89999 11.3 4.69999C11.5 4.51665 11.7333 4.42082 12 4.41249C12.2667 4.40415 12.5 4.49999 12.7 4.69999L19.3 11.3C19.4 11.4 19.4708 11.5083 19.5125 11.625C19.5542 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5542 12.2583 19.5125 12.375C19.4708 12.4917 19.4 12.6 19.3 12.7L12.7 19.3C12.5167 19.4833 12.2875 19.575 12.0125 19.575C11.7375 19.575 11.5 19.4833 11.3 19.3C11.1 19.1 11 18.8625 11 18.5875C11 18.3125 11.1 18.075 11.3 17.875L16.175 13Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
