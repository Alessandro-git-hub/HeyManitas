import React from 'react';

export default function CustomerCard({ customer, onEdit, onDelete, onViewDetails }) {
  const formatPhone = (phone) => {
    if (!phone) return '';
    // Simple phone formatting for display
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(customer)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary font-semibold text-lg">
              {getInitials(customer.name)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{customer.name || 'Unnamed Client'}</h3>
              {customer.hasJobs ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  No Jobs
                </span>
              )}
            </div>
            {customer.company && (
              <p className="text-sm text-gray-600">{customer.company}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(customer)}
            className="text-primary-600 hover:text-primary-800 transition-colors p-1"
            title="Edit customer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            className="text-red-600 hover:text-red-800 transition-colors p-1"
            title="Delete customer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {customer.email && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {customer.email}
          </div>
        )}
        
        {customer.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {formatPhone(customer.phone)}
          </div>
        )}

        {customer.address && (
          <div className="flex items-start text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">{customer.address}</span>
          </div>
        )}
      </div>

      {customer.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            <span className="font-medium">Notes:</span> {customer.notes}
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            Added {customer.createdAt?.toDate ? 
              customer.createdAt.toDate().toLocaleDateString() : 
              new Date(customer.createdAt).toLocaleDateString()
            }
          </span>
          <span className="text-primary cursor-pointer hover:text-primary-dark">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}
