import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import JobFormModal from '../components/JobFormModal';
import JobDetailsModal from '../components/JobDetailsModal';
import AddJobButton from '../components/AddJobButton';
import ActionButton from '../components/ActionButton';
import WorkerNavigation from '../components/WorkerNavigation';
import WorkerHeader from '../components/WorkerHeader';

export default function WorkerDashboard() {
  const navigate = useNavigate();

  // Form state for the modal
  const [showJobForm, setShowJobForm] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [todaysJobsCount, setTodaysJobsCount] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);
  
  // Job details modal state
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);

  // Function to get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Function to get start of current week (Monday)
  const getStartOfWeek = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so we need 6 days back
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  // Function to get end of current week (Sunday)
  const getEndOfWeek = useCallback(() => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }, [getStartOfWeek]);

  // Function to calculate weekly earnings
  const calculateWeeklyEarnings = useCallback((jobs) => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();
    
    return jobs.reduce((total, job) => {
      // Check if job has a scheduledDate within this week and is completed
      if (job.scheduledDate && (job.status === 'Done' || job.status === 'Completed')) {
        const jobDate = new Date(job.scheduledDate + 'T00:00:00');
        if (jobDate >= startOfWeek && jobDate <= endOfWeek) {
          const finalPrice = parseFloat(job.finalPrice) || 0;
          return total + finalPrice;
        }
      }
      return total;
    }, 0);
  }, [getStartOfWeek, getEndOfWeek]);

  // Function to get status styles
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

  // Function to format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleJobSuccess = (message) => {
    setFeedback({ message, type: 'success' });
    // Refresh today's jobs count, recent jobs, and weekly earnings
    const refreshData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'jobs'));
        const todaysDate = getTodaysDate();
        let count = 0;
        const allJobs = [];
        
        querySnapshot.forEach((doc) => {
          const job = { id: doc.id, ...doc.data() };
          allJobs.push(job);
          if (job.scheduledDate === todaysDate) {
            count++;
          }
        });
        
        setTodaysJobsCount(count);
        
        // Calculate weekly earnings
        const earnings = calculateWeeklyEarnings(allJobs);
        setWeeklyEarnings(earnings);
        
        // Sort jobs by creation date (most recent first) and take the first 3
        const sortedJobs = allJobs.sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return bDate - aDate;
        }).slice(0, 3);
        
        setRecentJobs(sortedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setTodaysJobsCount(0);
        setWeeklyEarnings(0);
        setRecentJobs([]);
      }
    };
    refreshData();
  };

  const handleJobError = (message) => {
    setFeedback({ message, type: 'error' });
  };

  const handleCloseModal = () => {
    setShowJobForm(false);
  };

  // Handler for opening job details modal
  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleCloseJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJob(null);
  };

  // Clear feedback after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Fetch today's jobs count, recent jobs, and weekly earnings when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'jobs'));
        const todaysDate = getTodaysDate();
        let count = 0;
        const allJobs = [];
        
        querySnapshot.forEach((doc) => {
          const job = { id: doc.id, ...doc.data() };
          allJobs.push(job);
          if (job.scheduledDate === todaysDate) {
            count++;
          }
        });
        
        setTodaysJobsCount(count);
        
        // Calculate weekly earnings
        const earnings = calculateWeeklyEarnings(allJobs);
        setWeeklyEarnings(earnings);
        
        // Sort jobs by creation date (most recent first) and take the first 3
        const sortedJobs = allJobs.sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return bDate - aDate;
        }).slice(0, 3);
        
        setRecentJobs(sortedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setTodaysJobsCount(0);
        setWeeklyEarnings(0);
        setRecentJobs([]);
      }
    };

    fetchData();
  }, [calculateWeeklyEarnings]);

  return (
    <div className="min-h-screen bg-light">
      {/* Header/Navigation */}
      <WorkerHeader />

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <span>{feedback.message}</span>
              {feedback.type === 'success' && (
                <button
                  onClick={() => navigate('/worker/jobs')}
                  className="text-sm text-green-800 hover:text-green-900 underline ml-4"
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
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 flex items-center rounded-lg shadow-sm border md:p-6 md:flex-col md:text-center">
              <div className="bg-primary/10 p-3 rounded-full md:mb-3">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4 md:ml-0">
                <p className="text-sm text-gray-600">Today's Jobs</p>
                <p className="text-2xl font-bold text-deep">{todaysJobsCount}</p>
              </div>
            </div>

            <div className="bg-white p-3 flex items-center rounded-lg shadow-sm border md:p-6 md:flex-col md:text-center">
              <div className="bg-warning/10 p-3 rounded-full md:mb-3">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4 md:ml-0">
                <p className="text-sm text-gray-600">Pending Quotes</p>
                <p className="text-2xl font-bold text-deep">2</p>
              </div>
            </div>

            <div className="bg-white p-3 flex items-center rounded-lg shadow-sm border md:p-6 md:flex-col md:text-center">
              <div className="bg-success/10 p-3 rounded-full md:mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4 md:ml-0">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-deep">€{weeklyEarnings.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white p-3 flex items-center rounded-lg shadow-sm border md:p-6 md:flex-col md:text-center">
              <div className="bg-accent/10 p-3 rounded-full md:mb-3">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4 md:ml-0">
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-deep">12</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-deep mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <AddJobButton onClick={() => setShowJobForm(true)} />
              <ActionButton variant="warning">
                Create Quote
              </ActionButton>
              <ActionButton variant="success">
                Add Client
              </ActionButton>
              <ActionButton variant="secondary">
                View Schedule
              </ActionButton>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-deep mb-4">Recent Jobs</h3>
              <div className="space-y-3">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job, index) => (
                    <div 
                      key={job.id} 
                      onClick={() => handleViewJobDetails(job)}
                      className={`flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors ${
                        index < recentJobs.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium text-deep">{job.client || job.clientName || 'Unknown Client'}</p>
                        <p className="text-sm text-gray-600">{job.description || 'No description'}</p>
                        {job.scheduledDate && (
                          <p className="text-xs text-gray-500">Scheduled: {formatDate(job.scheduledDate + 'T00:00:00')}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusStyles(job.status)}`}>
                          {job.status}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No jobs yet</p>
                    <p className="text-gray-400 text-xs">Add your first job to see it here</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => navigate('/worker/jobs')}
                className="mt-4 text-blue-800 text-sm hover:text-blue-900 cursor-pointer"
              >
                View all jobs →
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-deep mb-4">Recent Quotes</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-deep">Bathroom Renovation</p>
                    <p className="text-sm text-gray-600">Luis Martín - €2,400</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Sent</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-deep">Kitchen Wiring</p>
                    <p className="text-sm text-gray-600">María González - €850</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Draft</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-deep">Office Lighting</p>
                    <p className="text-sm text-gray-600">Tech Solutions - €1,200</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Accepted</span>
                </div>
              </div>
              <button className="mt-4 text-blue-800 text-sm hover:text-blue-900 cursor-pointer">
                View all quotes →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
