import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';
import { useWorkerAuth } from '../hooks/useWorkerAuth';
import { useBookings } from '../hooks/useBookings';
import { formatTime, formatDateShort, getBookingStatusStyles } from '../utils/formatters';

const BookingsOverview = () => {
  const navigate = useNavigate();
  const { user } = useWorkerAuth();
  const { recentBookings, pendingCount, loading } = useBookings(user);

  if (loading) {
    return (
      <div 
        className="rounded-2xl p-6 shadow-lg border border-brown relative z-1"
        style={{ backgroundColor: '#f4dfb8' }}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-2xl p-6 shadow-lg border border-brown relative z-1"
      style={{ backgroundColor: '#f4dfb8' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-primary-700">Recent Bookings</h3>
        <div className="flex items-center space-x-3">
          {pendingCount > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {pendingCount} pending
            </span>
          )}
          <button
            onClick={() => navigate('/worker/bookings')}
            className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
      </div>

      {recentBookings.length === 0 ? (
        <div className="text-center py-8">
          <FaCalendarAlt className="text-gray-400 text-3xl mx-auto mb-3" />
          <p className="text-gray-600">No bookings yet</p>
          <p className="text-sm text-gray-500">Customer appointments will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="text-primary-600 text-sm" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-primary-700 text-sm">
                      {booking.serviceType || 'Service Request'}
                    </p>
                    <p className="text-xs text-gray-600">{booking.customerEmail}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <span>{formatDateShort(booking.date)}</span>
                      <span>•</span>
                      <span>{formatTime(booking.time)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getBookingStatusStyles(booking.status)}`}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsOverview;
