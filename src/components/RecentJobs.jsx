import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateShort, getStatusStyles } from '../utils/formatters';
import { 
  DashboardContainer, 
  DashboardSectionHeader, 
  DashboardCard, 
  EmptyState 
} from './common/DashboardComponents';

const RecentJobs = ({ jobs = [], onJobClick, showViewAll = true }) => {
  const navigate = useNavigate();

  const viewAllButton = showViewAll && (
    <button 
      onClick={() => navigate('/worker/jobs')}
      className="text-primary-700 text-sm font-medium cursor-pointer"
    >
      View All →
    </button>
  );

  return (
    <DashboardContainer fitContent={true}>
      <DashboardSectionHeader
        title="Recent Jobs"
        actionButton={viewAllButton}
      />
      
      <div className="space-y-3">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <DashboardCard 
              key={job.id}
              onClick={() => onJobClick?.(job)}
              className={`border border-primary-700 hover:border-primary-300 ${
                index < jobs.length - 1 ? 'mb-3' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-primary-700">
                    {job.client || job.clientName || 'Unknown Client'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.description || 'No description'}
                  </p>
                  {job.scheduledDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled: {formatDateShort(job.scheduledDate + 'T00:00:00')}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusStyles(job.status)}`}>
                    {job.status}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-secondary-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </DashboardCard>
          ))
        ) : (
          <DashboardCard className="border border-primary-700">
            <EmptyState
              icon={({ className }) => (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                  />
                </svg>
              )}
              title="No jobs yet"
              description="Add your first job to see it here"
              className="text-primary-700"
              compact={true}
            />
          </DashboardCard>
        )}
      </div>
    </DashboardContainer>
  );
};

export default RecentJobs;
