import React from 'react';
import { FaCalendar, FaClock, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import StatusBadge from './common/StatusBadge';
import IconText from './common/IconText';
import ActionButton from './common/ActionButton';
import { formatDate, formatTime } from '../utils/formatters';

const BookingCard = ({ booking, onStatusUpdate, onViewDetails }) => {
  const isUpcoming = () => {
    const bookingDate = new Date(booking.datetime);
    const now = new Date();
    return bookingDate > now;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <StatusBadge status={booking.status} size="small" />
        {isUpcoming() && (
          <StatusBadge status="upcoming" size="small" />
        )}
      </div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <FaUser className="text-primary-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {booking.serviceType || 'Service Request'}
            </h3>
            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <IconText icon={FaCalendar}>{formatDate(booking.date)}</IconText>
        <IconText icon={FaClock}>{formatTime(booking.time)}</IconText>
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
          <IconText icon={FaPhone}>{booking.phone}</IconText>
        )}
        {booking.address && (
          <IconText icon={FaMapMarkerAlt} className="truncate">{booking.address}</IconText>
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
        <ActionButton
          variant="outline"
          size="small"
          onClick={() => onViewDetails && onViewDetails(booking)}
        >
          <FaEye className="mr-1" />
          View Details
        </ActionButton>
        
        <div className="flex space-x-2">
          {booking.status === 'pending' && (
            <>
              <ActionButton
                variant="danger-outline"
                size="small"
                onClick={() => onStatusUpdate(booking.id, 'cancelled')}
              >
                <FaTimes className="mr-1 inline" />
                Decline
              </ActionButton>
              <ActionButton
                variant="success"
                size="small"
                onClick={() => onStatusUpdate(booking.id, 'confirmed')}
              >
                <FaCheck className="mr-1 inline" />
                Accept
              </ActionButton>
            </>
          )}
          
          {booking.status === 'confirmed' && isUpcoming() && (
            <ActionButton
              variant="primary"
              size="small"
              onClick={() => onStatusUpdate(booking.id, 'completed')}
            >
              Mark Complete
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
