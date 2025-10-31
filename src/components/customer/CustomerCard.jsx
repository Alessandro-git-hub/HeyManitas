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
      className="bg-primary-700 p-6 rounded-2xl border border-secondary-600 cursor-pointer relative overflow-hidden group"
      onClick={() => onViewDetails && onViewDetails(customer)}
    >
      {/* Subtle accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-secondary-600 rounded-full flex items-center justify-center mr-3 shadow-md">
            <span className="text-primary-700 font-bold text-xl">
              {getInitials(customer.name)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-secondary-600">{customer.name || 'Unnamed Client'}</h3>
              {customer.hasJobs ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary-600 text-primary-700 shadow-sm">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-primary-700 shadow-sm" style={{ color: '#6F4E37' }}>
                  No Jobs
                </span>
              )}
            </div>
            {customer.company && (
              <p className="text-sm text-secondary-600 mt-1 font-medium">{customer.company}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {customer.email && (
          <div className="flex items-center text-sm text-white bg-primary-600 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 mr-2 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{customer.email}</span>
          </div>
        )}
        
        {customer.phone && (
          <div className="flex items-center text-sm text-white bg-primary-600 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 mr-2 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-medium">{formatPhone(customer.phone)}</span>
          </div>
        )}

        {customer.address && (
          <div className="flex items-start text-sm text-white bg-primary-600 px-3 py-2 rounded-lg">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-secondary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2 font-medium">{customer.address}</span>
          </div>
        )}
      </div>

      {customer.notes && (
        <div className="mt-4 pt-4 border-t border-white relative z-10">
          <p className="text-sm text-white line-clamp-2">
            <span className="font-bold text-secondary-600">Notes:</span> {customer.notes}
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white relative z-10">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary-600 font-medium">
            Added {customer.createdAt?.toDate ? 
              customer.createdAt.toDate().toLocaleDateString() : 
              new Date(customer.createdAt).toLocaleDateString()
            }
          </span>
          <span className="text-secondary-600 font-bold cursor-pointer hover:text-white transition-colors flex items-center gap-1">
            View Details 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
