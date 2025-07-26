import { useState } from 'react';

export function useJobFilters() {
  // Filter and sort state
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-newest');
  const [groupByDate, setGroupByDate] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  // Helper functions for filtering and sorting
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getThisWeekStart = () => {
    const today = new Date();
    const firstDay = today.getDate() - today.getDay();
    const weekStart = new Date(today.setDate(firstDay));
    return weekStart.toISOString().split('T')[0];
  };

  const getThisMonthStart = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  };

  const filterJobsByDate = (jobs, filter) => {
    if (filter === 'all') return jobs;
    
    const today = getTodaysDate();
    const weekStart = getThisWeekStart();
    const monthStart = getThisMonthStart();

    return jobs.filter(job => {
      if (!job.scheduledDate) return filter === 'all';
      
      switch (filter) {
        case 'today':
          return job.scheduledDate === today;
        case 'week':
          return job.scheduledDate >= weekStart;
        case 'month':
          return job.scheduledDate >= monthStart;
        default:
          return true;
      }
    });
  };

  const filterJobsByStatus = (jobs, filter) => {
    if (filter === 'all') return jobs;
    return jobs.filter(job => job.status === filter);
  };

  const sortJobs = (jobs, sortOption) => {
    const sortedJobs = [...jobs];
    
    switch (sortOption) {
      case 'date-newest':
        return sortedJobs.sort((a, b) => {
          const dateA = a.scheduledDate || '0000-00-00';
          const dateB = b.scheduledDate || '0000-00-00';
          return dateB.localeCompare(dateA);
        });
      case 'date-oldest':
        return sortedJobs.sort((a, b) => {
          const dateA = a.scheduledDate || '9999-99-99';
          const dateB = b.scheduledDate || '9999-99-99';
          return dateA.localeCompare(dateB);
        });
      case 'status': {
        const statusOrder = { 'In Progress': 1, 'Pending': 2, 'Done': 3, 'Cancelled': 4 };
        return sortedJobs.sort((a, b) => {
          const statusDiff = statusOrder[a.status] - statusOrder[b.status];
          if (statusDiff !== 0) return statusDiff;
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      }
      case 'client':
        return sortedJobs.sort((a, b) => a.clientName.localeCompare(b.clientName));
      default:
        return sortedJobs;
    }
  };

  const groupJobsByDate = (jobs) => {
    const grouped = {};
    jobs.forEach(job => {
      const date = job.scheduledDate || 'No date';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(job);
    });
    return grouped;
  };

  const formatDateHeader = (dateString) => {
    if (dateString === 'No date') return 'No scheduled date';
    
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateString === todayStr) return 'Today';
    if (dateString === yesterdayStr) return 'Yesterday';
    if (dateString === tomorrowStr) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (jobs) => {
    let filtered = jobs;
    filtered = filterJobsByDate(filtered, dateFilter);
    filtered = filterJobsByStatus(filtered, statusFilter);
    return sortJobs(filtered, sortBy);
  };

  // Toggle group collapse state
  const toggleGroupCollapse = (dateKey) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  return {
    // State
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
    
    // Functions
    applyFiltersAndSort,
    groupJobsByDate,
    formatDateHeader,
    toggleGroupCollapse
  };
}
