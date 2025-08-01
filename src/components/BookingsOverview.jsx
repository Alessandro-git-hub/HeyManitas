import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaEye } from 'react-icons/fa';

const BookingsOverview = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  
  // Mock user for testing when not authenticated
  const user = useMemo(() => authUser || {
    uid: 'HAvFzlKF2KbO5SplMANPACpAflL2',
    email: 'alessandropoggio@gmail.com',
    displayName: 'Alessandro Poggio'
  }, [authUser]);
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingsOverview = async () => {
      if (!user) return;

      try {
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
        setRecentBookings(allBookings.slice(0, 3));

        // Count pending bookings
        const pending = allBookings.filter(b => b.status === 'pending').length;
        setPendingCount(pending);
      } catch (error) {
        console.error('Error fetching bookings overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsOverview();
  }, [user]);

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-deep">Recent Bookings</h3>
        <div className="flex items-center space-x-3">
          {pendingCount > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {pendingCount} pending
            </span>
          )}
          <button
            onClick={() => navigate('/worker/bookings')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
      </div>

      {recentBookings.length === 0 ? (
        <div className="text-center py-8">
          <FaCalendarAlt className="text-gray-300 text-3xl mx-auto mb-3" />
          <p className="text-gray-500">No bookings yet</p>
          <p className="text-sm text-gray-400">Customer appointments will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-600 text-sm" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-deep text-sm">
                    {booking.serviceType || 'Service Request'}
                  </p>
                  <p className="text-xs text-gray-600">{booking.customerEmail}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>{formatDate(booking.date)}</span>
                    <span>•</span>
                    <span>{formatTime(booking.time)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <button 
                  onClick={() => navigate('/worker/bookings')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaEye className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsOverview;
