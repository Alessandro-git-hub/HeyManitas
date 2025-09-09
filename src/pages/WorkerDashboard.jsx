import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerAuth } from '../hooks/useWorkerAuth';
import { useWorkerDashboard } from '../hooks/useWorkerDashboard';
import { useFeedback } from '../hooks/useFeedback';
import JobFormModal from '../components/job/JobFormModal';
import JobDetailsModal from '../components/job/JobDetailsModal';
import ActionButton from '../components/common/ActionButton';
import QuickActionButton from '../components/common/QuickActionButton';
import StatCard from '../components/common/StatCard';
import WorkerNavigation from '../components/layout/WorkerNavigation';
import AppHeader from '../components/layout/AppHeader';
import BookingsOverview from '../components/BookingsOverview';
import RecentJobs from '../components/RecentJobs';
import RecentQuotes from '../components/RecentQuotes';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { user } = useWorkerAuth();
  const { 
    todaysJobsCount, 
    recentJobs, 
    activeClientsCount, 
    weeklyEarnings, 
    pendingQuotesCount,
    refreshData 
  } = useWorkerDashboard(user);
  const { feedback, showSuccess, showError, clearFeedback } = useFeedback();

  // Form state for modals
  const [showJobForm, setShowJobForm] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobSuccess = (message) => {
    showSuccess(message);
    refreshData(); // Refresh dashboard data after successful job creation
  };

  const handleJobError = (message) => {
    showError(message);
  };

  const handleCloseModal = () => {
    setShowJobForm(false);
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleCloseJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJob(null);
  };

  const handleViewQuotes = () => {
    navigate('/worker/quotes');
  };

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        clearFeedback();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback, clearFeedback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle dots background pattern */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(circle,rgba(205,169,97,0.2)_1px,transparent_1px)]
        bg-[length:22px_22px]" />

      {/* Header/Navigation */}
      <AppHeader />

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 pt-16 md:pt-20 relative z-10">
        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mb-6 p-6 rounded-2xl shadow-lg border relative z-1 ${
            feedback.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="font-medium">{feedback.message}</span>
              {feedback.type === 'success' && (
                <button
                  onClick={() => navigate('/worker/jobs')}
                  className="text-sm text-green-800 hover:text-green-900 underline ml-4 font-medium"
                >
                  View all jobs →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Job Form Modal */}
        <JobFormModal
          isOpen={showJobForm}
          onClose={handleCloseModal}
          onSuccess={handleJobSuccess}
          onError={handleJobError}
        />

        {/* Job Details Modal */}
        <JobDetailsModal
          isOpen={showJobDetails}
          onClose={handleCloseJobDetails}
          job={selectedJob}
        />

        {/* Navigation Tabs */}
        <WorkerNavigation />

        {/* Dashboard Content */}
        <div className="space-y-6 relative z-1">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Today's Jobs"
              value={todaysJobsCount}
            />
            
            <StatCard 
              title="Pending Quotes"
              value={pendingQuotesCount}
              onClick={pendingQuotesCount > 0 ? handleViewQuotes : undefined}
              clickable={pendingQuotesCount > 0}
              subtitle={pendingQuotesCount > 0 ? "Click to view →" : undefined}
            />
            
            <StatCard 
              title="Earned This Week"
              value={`€${weeklyEarnings.toFixed(2)}`}
            />
            
            <StatCard 
              title="Active Clients"
              value={activeClientsCount}
            />
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl p-6 shadow-lg relative z-1 border border-[#f4dfb8]" style={{ backgroundColor: '#6F4E37' }}>
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <QuickActionButton onClick={() => setShowJobForm(true)}>
                Add New Job
              </QuickActionButton>
              <QuickActionButton>
                Create Quote
              </QuickActionButton>
              <QuickActionButton>
                Add Client
              </QuickActionButton>
              <QuickActionButton>
                View Schedule
              </QuickActionButton>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BookingsOverview />
            
            <div className="rounded-2xl p-6 shadow-lg border border-brown relative z-1" style={{ backgroundColor: '#f4dfb8' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-primary-700">Recent Jobs</h3>
                <button 
                  onClick={() => navigate('/worker/jobs')}
                  className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job, index) => (
                    <div 
                      key={job.id} 
                      onClick={() => handleViewJobDetails(job)}
                      className={`bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 border border-primary-700 hover:border-primary-300 ${
                        index < recentJobs.length - 1 ? 'mb-3' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-semibold text-primary-700">{job.client || job.clientName || 'Unknown Client'}</p>
                          <p className="text-sm text-gray-600 mt-1">{job.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {job.status}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-secondary-600 flex items-center justify-center">
                            <svg className="w-3 h-3 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-xl border border-primary-700">
                    <div className="text-primary-700 mb-3">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                        />
                      </svg>
                    </div>
                    <p className="text-primary-700 font-semibold mb-1">No jobs yet</p>
                    <p className="text-gray-600 text-sm">Add your first job to see it here</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl p-6 shadow-lg border border-brown relative z-1" style={{ backgroundColor: '#f4dfb8' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-primary-700">Recent Quotes</h3>
                <button 
                  onClick={handleViewQuotes}
                  className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-primary-700 transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-primary-700">Bathroom Renovation</p>
                      <p className="text-sm text-gray-600">Luis Martín - €2,400</p>
                    </div>
                    <span className="text-xs bg-secondary-600 text-primary-700 px-3 py-1 rounded-full font-medium">Sent</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-primary-700 transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-primary-700">Kitchen Wiring</p>
                      <p className="text-sm text-gray-600">María González - €850</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">Draft</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-primary-700 transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-primary-700">Office Lighting</p>
                      <p className="text-sm text-gray-600">Tech Solutions - €1,200</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
