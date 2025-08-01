import React from 'react';
import { FaCalendar, FaClock, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const BookingCard = ({ booking, onStatusUpdate, onViewDetails }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isUpcoming = () => {
    const bookingDate = new Date(booking.datetime);
    const now = new Date();
    return bookingDate > now;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {booking.serviceType || 'Service Request'}
            </h3>
            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
          {isUpcoming() && (
            <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaCalendar className="mr-2 text-gray-400" />
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaClock className="mr-2 text-gray-400" />
          <span>{formatTime(booking.time)}</span>
        </div>
      </div>

      {/* Description */}
      {booking.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-2">
            {booking.description}
          </p>
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {booking.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <FaPhone className="mr-2 text-gray-400" />
            <span>{booking.phone}</span>
          </div>
        )}
        {booking.address && (
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-gray-400" />
            <span className="truncate">{booking.address}</span>
          </div>
        )}
      </div>

      {/* Pricing */}
      {booking.hourlyRate && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Rate: <span className="font-semibold text-gray-800">${booking.hourlyRate}/hour</span>
          </p>
          {booking.budget && (
            <p className="text-sm text-gray-600">
              Budget: <span className="text-gray-800">{booking.budget}</span>
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails(booking)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
        >
          <FaEye className="mr-1" />
          View Details
        </button>
        
        <div className="flex space-x-2">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded transition-colors"
              >
                <FaTimes className="mr-1 inline" />
                Decline
              </button>
              <button
                onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                <FaCheck className="mr-1 inline" />
                Accept
              </button>
            </>
          )}
          
          {booking.status === 'confirmed' && isUpcoming() && (
            <button
              onClick={() => onStatusUpdate(booking.id, 'completed')}
              className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
