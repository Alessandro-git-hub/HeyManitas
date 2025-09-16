import { useState } from 'react';
import { STATUS_ORDER } from '../utils/statusConfig';

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
      const jobDate = job.scheduledDate || job.date;
      if (!jobDate) return filter === 'all';
      
      switch (filter) {
        case 'today':
          return jobDate === today;
        case 'week':
          return jobDate >= weekStart;
        case 'month':
          return jobDate >= monthStart;
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
          const dateA = a.scheduledDate || a.date || '0000-00-00';
          const dateB = b.scheduledDate || b.date || '0000-00-00';
          return dateB.localeCompare(dateA);
        });
      case 'date-oldest':
        return sortedJobs.sort((a, b) => {
          const dateA = a.scheduledDate || a.date || '9999-99-99';
          const dateB = b.scheduledDate || b.date || '9999-99-99';
          return dateA.localeCompare(dateB);
        });
      case 'status': {
        return sortedJobs.sort((a, b) => {
          const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
          if (statusDiff !== 0) return statusDiff;
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        });
      }
      case 'client':
        return sortedJobs.sort((a, b) => {
          const clientA = a.clientName || a.client || a.customerName || '';
          const clientB = b.clientName || b.client || b.customerName || '';
          return clientA.localeCompare(clientB);
        });
      default:
        return sortedJobs;
    }
  };

  const groupJobsByDate = (jobs) => {
    const grouped = {};
    jobs.forEach(job => {
      const date = job.scheduledDate || job.date || 'No date';
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
