import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';

export const useBookingRequests = (user) => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookingRequests = useCallback(async () => {
    if (!user) {
      return;
    }
    
    try {
      setLoading(true);
      
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('professionalId', '==', user.uid),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(bookingsQuery);
      const requests = [];
      
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        requests.push(data);
      });
      
      // Sort by creation date (newest first)
      requests.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setBookingRequests(requests);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookingRequests();
  }, [fetchBookingRequests]);

  return {
    bookingRequests,
    loading,
    fetchBookingRequests
  };
};