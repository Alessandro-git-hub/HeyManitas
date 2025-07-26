import React from 'react';
import JobCard from './JobCard';

export default function JobsList({
  jobs,
  groupByDate,
  collapsedGroups,
  groupJobsByDate,
  formatDateHeader,
  toggleGroupCollapse,
  onEdit,
  onDelete,
  onViewDetails,
  emptyStateProps = {}
}) {
  const {
    title = 'No jobs yet',
    message = 'Start by adding your first job.',
    showAddButton = false,
    onAddClick = null,
    addButtonText = 'Add Your First Job'
  } = emptyStateProps;

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {addButtonText}
          </button>
        )}
      </div>
    );
  }

  if (groupByDate) {
    return (
      <div className="space-y-6">
        {Object.entries(groupJobsByDate(jobs))
          .sort(([dateA], [dateB]) => {
            if (dateA === 'No date') return 1;
            if (dateB === 'No date') return -1;
            return dateB.localeCompare(dateA);
          })
          .map(([date, dateJobs]) => {
            const isCollapsed = collapsedGroups.has(date);
            return (
              <div key={date} className="space-y-4">
                <div 
                  className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  onClick={() => toggleGroupCollapse(date)}
                >
                  <button className="flex items-center text-left w-full">
                    <div className={`mr-3 transition-transform duration-200 cursor-pointer ${isCollapsed ? '' : 'rotate-90'}`}>
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {formatDateHeader(date)}
                    </h3>
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="ml-3 text-sm text-gray-500">
                      {dateJobs.length} job{dateJobs.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                </div>
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dateJobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onEdit={() => onEdit && onEdit(job)}
                        onDelete={() => onDelete && onDelete(job.id)}
                        onViewDetails={() => onViewDetails && onViewDetails(job)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={() => onEdit && onEdit(job)}
          onDelete={() => onDelete && onDelete(job.id)}
          onViewDetails={() => onViewDetails && onViewDetails(job)}
        />
      ))}
    </div>
  );
}
