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
    <div className="bg-primary-700 rounded-lg shadow-sm border border-secondary-600 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <StatusBadge status={booking.status} size="small" className="ml-auto"/>
        {isUpcoming() && (
          <StatusBadge status="upcoming" size="small" className="ml-auto"/>
        )}
      </div>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center bg-white">
              <FaUser />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-600">
              {booking.serviceType || 'Service Request'}
            </h3>
            <p className="text-sm text-white">{booking.customerEmail}</p>
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <IconText icon={FaCalendar} iconClassName="text-secondary-600" textClassName="text-white">{formatDate(booking.date)}</IconText>
        <IconText icon={FaClock} iconClassName="text-secondary-600" textClassName="text-white">{formatTime(booking.time)}</IconText>
      </div>

      {/* Description */}
      {booking.description && (
        <div className="mb-4 border-b border-white pb-4">
          <p className="text-sm text-secondary-600 line-clamp-2">
            Description: <br />
            <span className="text-white">{booking.description}</span>
          </p>
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {booking.phone && (
          <IconText icon={FaPhone} iconClassName="text-secondary-600" textClassName="text-white">{booking.phone}</IconText>
        )}
        {booking.address && (
          <IconText icon={FaMapMarkerAlt} iconClassName="text-secondary-600" textClassName="text-white" className="truncate">{booking.address}</IconText>
        )}
      </div>

      {/* Pricing */}
      {booking.hourlyRate && (
        <div className="mb-4 p-3 bg-secondary-600 rounded-lg">
          <p className="text-sm text-primary-700">
            Rate: <span className="font-semibold text-primary-700">${booking.hourlyRate}/hour</span>
          </p>
          {booking.budget && (
            <p className="text-sm text-primary-700">
              Budget: <span className="text-primary-700">{booking.budget}</span>
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-white">
        <ActionButton
          variant="outline"
          size="small"
          className="ml-auto"
          onClick={() => onViewDetails && onViewDetails(booking)}
        >
          View Details
          <FaEye className="ml-2" />
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
