import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

/**
 * Custom hook for fetching worker dashboard data
 * Centralizes all data fetching logic for the dashboard
 */
export const useWorkerDashboard = (user) => {
  const [dashboardData, setDashboardData] = useState({
    todaysJobsCount: 0,
    recentJobs: [],
    activeClientsCount: 0,
    weeklyEarnings: 0,
    pendingQuotesCount: 0,
    loading: true
  });

  // Helper functions for date calculations
  const getStartOfWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const getEndOfWeek = () => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  };

  const calculateWeeklyEarnings = (jobs) => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();
    
    return jobs.reduce((total, job) => {
      if (job.scheduledDate && (job.status === 'Done' || job.status === 'Completed')) {
        const jobDate = new Date(job.scheduledDate + 'T00:00:00');
        if (jobDate >= startOfWeek && jobDate <= endOfWeek) {
          const finalPrice = parseFloat(job.finalPrice) || 0;
          return total + finalPrice;
        }
      }
      return total;
    }, 0);
  };

  const calculateActiveClients = async (jobs) => {
    if (!user) return 0;
    
    try {
      const customersQuery = query(collection(db, 'customers'), where('userId', '==', user.uid));
      const customersSnapshot = await getDocs(customersQuery);
      
      const clientNamesWithJobs = new Set();
      jobs.forEach((job) => {
        if (job.status !== 'Cancelled') {
          const clientName = job.client || job.clientName;
          if (clientName && clientName.trim()) {
            clientNamesWithJobs.add(clientName.toLowerCase().trim());
          }
        }
      });
      
      let activeCustomersCount = 0;
      customersSnapshot.forEach((doc) => {
        const customer = doc.data();
        const customerName = (customer.name || '').toLowerCase().trim();
        if (clientNamesWithJobs.has(customerName)) {
          activeCustomersCount++;
        }
      });
      
      return activeCustomersCount;
    } catch (error) {
      console.error('Error calculating active clients:', error);
      return 0;
    }
  };

  const fetchPendingQuotes = async () => {
    if (!user) return 0;
    
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'), 
        where('professionalId', '==', user.uid),
        where('status', '==', 'pending')
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      return bookingsSnapshot.size;
    } catch (error) {
      console.error('Error fetching pending quotes:', error);
      return 0;
    }
  };

  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchDashboardData = async () => {
    if (!user) {
      setDashboardData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setDashboardData(prev => ({ ...prev, loading: true }));

      // Fetch jobs
      const jobsQuery = query(collection(db, 'jobs'), where('userId', '==', user.uid));
      const jobsSnapshot = await getDocs(jobsQuery);
      const todaysDate = getTodaysDate();
      let todaysCount = 0;
      const allJobs = [];
      
      jobsSnapshot.forEach((doc) => {
        const job = { id: doc.id, ...doc.data() };
        allJobs.push(job);
        if (job.scheduledDate === todaysDate) {
          todaysCount++;
        }
      });
      
      // Calculate metrics
      const earnings = calculateWeeklyEarnings(allJobs);
      const clientsCount = await calculateActiveClients(allJobs);
      const quotesCount = await fetchPendingQuotes();
      
      // Sort jobs by creation date (most recent first) and take the first 3
      const sortedJobs = allJobs.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return bDate - aDate;
      }).slice(0, 3);

      setDashboardData({
        todaysJobsCount: todaysCount,
        recentJobs: sortedJobs,
        activeClientsCount: clientsCount,
        weeklyEarnings: earnings,
        pendingQuotesCount: quotesCount,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        todaysJobsCount: 0,
        recentJobs: [],
        activeClientsCount: 0,
        weeklyEarnings: 0,
        pendingQuotesCount: 0,
        loading: false
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...dashboardData,
    refreshData: fetchDashboardData
  };
};
