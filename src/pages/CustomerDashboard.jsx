import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import CustomerBookingCard from '../components/customer/CustomerBookingCard';
import AppHeader from '../components/layout/AppHeader';
import CustomerNavigation from '../components/layout/CustomerNavigation';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed

  const fetchCustomerBookings = useCallback(async () => {
    try {
      setLoading(true);
      
      // If no user is authenticated, show empty state
      if (!user) {
        setBookings([]);
        return;
      }

      const bookingsRef = collection(db, 'bookings');
      
      // Fetch bookings for the authenticated user's email
      const userBookingsQuery = query(
        bookingsRef,
        where('customerEmail', '==', user.email)
      );
      
      const querySnapshot = await getDocs(userBookingsQuery);
      const bookingsList = [];
      
      querySnapshot.forEach((doc) => {
        bookingsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort by datetime (newest first)
      bookingsList.sort((a, b) => {
        const dateA = new Date(a.datetime || a.date);
        const dateB = new Date(b.datetime || b.date);
        return dateB - dateA;
      });
      
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchCustomerBookings();
    }
  }, [fetchCustomerBookings, authLoading]);

  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your bookings.</p>
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

  const handlePaymentComplete = (booking, paymentData) => {
    // Update local state to reflect payment completion
    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.id === booking.id
          ? { ...b, paymentStatus: 'paid', amountPaid: paymentData.amount }
          : b
      )
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStats = () => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      quoted: bookings.filter(b => b.status === 'quoted').length,
      confirmed: bookings.filter(b => b.status === 'confirmed' || b.status === 'quote_accepted').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      paid: bookings.filter(b => b.paymentStatus === 'paid').length,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <AppHeader />
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        {/* Navigation */}
        <CustomerNavigation />
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your service appointments and payments</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div 
            onClick={stats.quoted > 0 ? () => navigate('/customer/profile?tab=quotes') : undefined}
            className={`bg-white p-4 rounded-lg shadow-sm border ${
              stats.quoted > 0 ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
            }`}
          >
            <div className="text-2xl font-bold text-primary-600">{stats.quoted}</div>
            <div className="text-sm text-gray-600">Quotes Received</div>
            {stats.quoted > 0 && (
              <div className="text-xs text-primary-600 mt-1">Click to view</div>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div 
            onClick={stats.paid > 0 ? () => navigate('/customer/calendar') : undefined}
            className={`bg-white p-4 rounded-lg shadow-sm border ${
              stats.paid > 0 ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
            }`}
          >
            <div className="text-2xl font-bold text-emerald-600">{stats.paid}</div>
            <div className="text-sm text-gray-600">Paid & Scheduled</div>
            {stats.paid > 0 && (
              <div className="text-xs text-emerald-600 mt-1">View calendar</div>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
            { key: 'completed', label: 'Completed', count: stats.completed },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'Start by booking a service from our professionals.' 
                : `You don't have any ${filter} bookings at the moment.`}
            </p>
            <button
              onClick={() => window.location.href = '/customer/services'}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <CustomerBookingCard
                key={booking.id}
                booking={booking}
                onPaymentComplete={handlePaymentComplete}
              />
            ))}
          </div>
        )}

        {/* Payment Instructions */}
        {stats.confirmed > stats.paid && (
          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-semibold text-primary-900 mb-2">Payment Required</h3>
            <p className="text-primary-800 text-sm">
              You have confirmed bookings that require payment. Click "Pay Now" on any confirmed booking to complete your payment securely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
