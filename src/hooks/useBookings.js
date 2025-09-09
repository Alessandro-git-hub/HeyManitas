import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

/**
 * Custom hook for fetching bookings data
 * Centralizes bookings data fetching logic
 */
export const useBookings = (user) => {
  const [bookingsData, setBookingsData] = useState({
    recentBookings: [],
    pendingCount: 0,
    loading: true
  });

  const fetchBookings = async () => {
    if (!user) {
      setBookingsData({ recentBookings: [], pendingCount: 0, loading: false });
      return;
    }

    try {
      setBookingsData(prev => ({ ...prev, loading: true }));

      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('professionalId', '==', user.uid)
      );

      const querySnapshot = await getDocs(bookingsQuery);
      const allBookings = [];
      querySnapshot.forEach((doc) => {
        allBookings.push({ id: doc.id, ...doc.data() });
      });

      // Sort by datetime and get most recent 3
      allBookings.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
      
      setBookingsData({
        recentBookings: allBookings.slice(0, 3),
        pendingCount: allBookings.filter(b => b.status === 'pending').length,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingsData({
        recentBookings: [],
        pendingCount: 0,
        loading: false
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...bookingsData
  };
};
