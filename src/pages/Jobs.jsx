import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import JobCard from '../components/JobCard';
import JobFormModal from '../components/JobFormModal';
import AddJobButton from '../components/AddJobButton';
import WorkerNavigation from '../components/WorkerNavigation';
import WorkerHeader from '../components/WorkerHeader';
import JobFilters from '../components/JobFilters';
import JobsList from '../components/JobsList';
import JobDetailsModal from '../components/JobDetailsModal';
import { useJobFilters } from '../hooks/useJobFilters';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  
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

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'jobs'));
      const jobsData = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort jobs: In Progress first, then Pending, then Done, then Cancelled
      // Within each status, sort by creation date (newest first)
      const statusOrder = { 'In Progress': 1, 'Pending': 2, 'Done': 3, 'Cancelled': 4 };
      jobsData.sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        // Sort by creation date (newest first)
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setFeedback({ message: 'Error loading jobs. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting to jobs
  const filteredAndSortedJobs = applyFiltersAndSort(jobs);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setFeedback({ message: 'Job deleted successfully!', type: 'success' });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      setFeedback({ message: 'Error deleting job. Please try again.', type: 'error' });
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
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <WorkerHeader />
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <WorkerNavigation />
          <h1 className="text-3xl font-bold mb-6 text-gray-900">My Jobs</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <WorkerHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Worker Navigation Tabs */}
        <WorkerNavigation />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <AddJobButton onClick={() => setShowForm(true)} />
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
          emptyStateProps={{
            title: jobs.length === 0 ? 'No jobs yet' : 'No jobs match your filters',
            message: jobs.length === 0 
              ? 'Start by adding your first job or use test data to get started.' 
              : 'Try adjusting your filters to see more results.',
            showAddButton: jobs.length === 0,
            onAddClick: () => setShowForm(true),
            addButtonText: 'Add Your First Job'
          }}
        />
      </div>
    </div>
  );
}
