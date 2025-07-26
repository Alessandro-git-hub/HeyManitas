import React from 'react';

export default function JobCard({ job, onEdit, onDelete, onViewDetails }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default: // Pending
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails && onViewDetails(job)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{job.client}</h3>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(job)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit job"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete job"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{job.description}</p>
      
      {job.scheduledDate && (
        <div className="mb-3">
          <span className="text-sm text-blue-700 font-medium">
            📅 Scheduled: {job.scheduledDate}
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(job.status)}`}>
          {job.status}
        </span>
        {job.createdAt && (
          <span className="text-xs text-gray-500">
            Created {formatDate(job.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}
