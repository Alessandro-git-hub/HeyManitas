import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useHeader } from '../hooks/useHeader';
import JobCard from '../components/job/JobCard';
import BookingCard from '../components/BookingCard';
import JobFormModal from '../components/job/JobFormModal';
import ActionButton from '../components/common/ActionButton';
import DottedBackground from '../components/common/DottedBackground';
import WorkerNavigation from '../components/layout/WorkerNavigation';
import AppHeader from '../components/layout/AppHeader';
import JobFilters from '../components/job/JobFilters';
import JobsList from '../components/job/JobsList';
import JobDetailsModal from '../components/job/JobDetailsModal';
import { useJobFilters } from '../hooks/useJobFilters';
import { updateBookingStatus } from '../utils/updateBookingStatus';
import { STATUS_ORDER } from '../utils/statusConfig';
import { normalizeBookingData, normalizeJobData, sortItemsByStatusAndDate } from '../utils/dataHelpers';

export default function Jobs() {
  const { user, loading: authLoading } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useHeader();
  
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [viewMode, setViewMode] = useState('all'); // all, bookings, jobs
  
  // Job details modal state
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Use the job filters hook
  const {
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    groupByDate,
    setGroupByDate,
    collapsedGroups,
    setCollapsedGroups,
    applyFiltersAndSort,
    groupJobsByDate,
    formatDateHeader,
    toggleGroupCollapse
  } = useJobFilters();

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      
      // If no user is authenticated, show empty state
      if (!user) {
        setAllItems([]);
        return;
      }
      
      // Fetch traditional jobs from Firestore
      const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', user.uid));
      const jobsSnapshot = await getDocs(jobsQuery);
      const jobsData = [];
      jobsSnapshot.forEach((doc) => {
        jobsData.push(normalizeJobData(doc.data(), doc.id));
      });
      
      // Fetch bookings from Firestore
      const bookingsQuery = query(collection(db, 'bookings'), where('professionalId', '==', user.uid));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsData = [];
      bookingsSnapshot.forEach((doc) => {
        bookingsData.push(normalizeBookingData(doc.data(), doc.id));
      });
      
      // Combine jobs and bookings
      const allData = [...jobsData, ...bookingsData];
      
      // Sort combined data: Pending first, then Quoted, Confirmed, etc.
      const sortedData = sortItemsByStatusAndDate(allData, STATUS_ORDER);
      
      setAllItems(sortedData);
    } catch (error) {
      console.error('Error fetching jobs and bookings:', error);
      setFeedback({ message: 'Error loading data. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Apply filters and sorting to combined data (allItems instead of jobs)
  const applyViewModeFilter = (items) => {
    if (viewMode === 'all') return items;
    return items.filter(item => item.itemType === viewMode.slice(0, -1)); // 'bookings' -> 'booking', 'jobs' -> 'job'
  };

  const filteredAndSortedJobs = applyFiltersAndSort(applyViewModeFilter(allItems));

  // Handle booking status updates
  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      if (result.success) {
        setFeedback({ message: 'Booking status updated successfully!', type: 'success' });
        fetchJobs(); // Refresh data
      } else {
        throw new Error(result.error || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      setFeedback({ message: 'Error updating booking status.', type: 'error' });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setFeedback({ message: 'Item deleted successfully!', type: 'success' });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting item:', error);
      setFeedback({ message: 'Error deleting item. Please try again.', type: 'error' });
    }
  };

  const startEdit = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleCloseJobDetails = () => {
    setShowJobDetails(false);
    setSelectedJob(null);
  };

  const handleJobSuccess = (message) => {
    setFeedback({ message, type: 'success' });
    setEditingJob(null);
    fetchJobs(); // Refresh the jobs list
  };

  const handleJobError = (message) => {
    setFeedback({ message, type: 'error' });
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  const toggleWorkerMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

  useEffect(() => {
    if (!authLoading) {
      fetchJobs();
    }
  }, [fetchJobs, authLoading]);

  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your jobs and bookings.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DottedBackground>
        <AppHeader 
          showWorkerNav={true}
          toggleWorkerMobileMenu={toggleWorkerMobileMenu}
        />
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 pt-16 md:pt-20">
          <WorkerNavigation 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          </div>
        </div>
      </DottedBackground>
    );
  }

  return (
    <DottedBackground>
      <AppHeader 
        showWorkerNav={true}
        toggleWorkerMobileMenu={toggleWorkerMobileMenu}
      />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 pt-16 md:pt-20">
        {/* Worker Navigation Tabs */}
        <WorkerNavigation 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Header Section - Responsive Layout */}
        <div className="mb-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-primary-700 mb-4 mt-4 md:mt-0">
            {viewMode === 'bookings' ? 'Bookings' : 
             viewMode === 'jobs' ? 'Jobs' : 
             'Jobs & Bookings'}
          </h1>
          
          {/* Controls Row - Mode Toggle and Action Button */}
          <div className="flex justify-between items-center">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'all' 
                    ? 'bg-secondary-600 text-primary-700' 
                    : 'text-primary-700 cursor-pointer'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setViewMode('bookings')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'bookings' 
                    ? 'bg-secondary-600 text-primary-700' 
                    : 'text-primary-700 cursor-pointer'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setViewMode('jobs')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'jobs' 
                    ? 'bg-secondary-600 text-primary-700' 
                    : 'text-primary-700 cursor-pointer'
                }`}
              >
                Jobs
              </button>
            </div>
            
            {/* Action Button */}
            <ActionButton
              className='w-fit' 
              onClick={() => setShowForm(true)}
              variant="primary"
            >
              Add New Job
            </ActionButton>
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <JobFilters
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          groupByDate={groupByDate}
          setGroupByDate={setGroupByDate}
          collapsedGroups={collapsedGroups}
          setCollapsedGroups={setCollapsedGroups}
          filteredJobs={filteredAndSortedJobs}
          groupJobsByDate={groupJobsByDate}
          showGroupControls={true}
        />

        {/* Feedback Message */}
        {feedback.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <span>{feedback.message}</span>
              <button
                onClick={() => setFeedback({ message: '', type: '' })}
                className={`text-sm hover:opacity-70 ml-4 ${
                  feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Job Form Modal */}
        <JobFormModal
          isOpen={showForm}
          onClose={handleCloseModal}
          editingJob={editingJob}
          onSuccess={handleJobSuccess}
          onError={handleJobError}
        />

        {/* Job Details Modal */}
        <JobDetailsModal
          isOpen={showJobDetails}
          onClose={handleCloseJobDetails}
          job={selectedJob}
        />

        {/* Jobs List */}
        <JobsList
          jobs={filteredAndSortedJobs}
          groupByDate={groupByDate}
          collapsedGroups={collapsedGroups}
          groupJobsByDate={groupJobsByDate}
          formatDateHeader={formatDateHeader}
          toggleGroupCollapse={toggleGroupCollapse}
          onEdit={startEdit}
          onDelete={handleDeleteJob}
          onViewDetails={handleViewJobDetails}
          onBookingStatusUpdate={handleBookingStatusUpdate}
          emptyStateProps={{
            title: allItems.length === 0 ? 'No items yet' : 'No items match your filters',
            message: allItems.length === 0 
              ? 'Start by managing bookings or adding jobs to get started.' 
              : 'Try adjusting your filters to see more results.',
            showAddButton: allItems.length === 0,
            onAddClick: () => setShowForm(true),
            addButtonText: 'Add Your First Job'
          }}
        />
      </div>
    </DottedBackground>
  );
}
