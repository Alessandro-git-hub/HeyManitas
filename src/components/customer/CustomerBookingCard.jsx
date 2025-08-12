import React, { useState } from 'react';
import { FaCalendar, FaClock, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import PaymentModal from '../payment/PaymentModal';

const CustomerBookingCard = ({ booking, onPaymentComplete }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const getPaymentStatusStyles = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
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
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotal = () => {
    const serviceAmount = booking.hourlyRate || 0;
    const serviceFee = serviceAmount * 0.05;
    return serviceAmount + serviceFee;
  };

  const handlePaymentComplete = (updatedBooking, paymentData) => {
    setShowPaymentModal(false);
    onPaymentComplete?.(updatedBooking, paymentData);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Header with Status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {booking.serviceType}
            </h3>
            <p className="text-sm text-gray-600">
              with {booking.professionalName}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            {booking.paymentStatus && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusStyles(booking.paymentStatus)}`}>
                {booking.paymentStatus === 'paid' ? 'Paid' : 
                 booking.paymentStatus === 'pending' ? 'Payment Pending' : 
                 'Payment Required'}
              </span>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendar className="mr-2 text-gray-400" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-2 text-gray-400" />
            <span>{formatTime(booking.time)}</span>
          </div>
        </div>

        {/* Service Details */}
        {booking.description && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Service Description:</h4>
            <p className="text-sm text-gray-600">{booking.description}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {booking.customerEmail && (
            <div className="flex items-center text-sm text-gray-600">
              <FaEnvelope className="mr-2 text-gray-400" />
              <span className="truncate">{booking.customerEmail}</span>
            </div>
          )}
          {booking.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <FaPhone className="mr-2 text-gray-400" />
              <span>{booking.phone}</span>
            </div>
          )}
        </div>

        {/* Address */}
        {booking.address && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              <span>{booking.address}</span>
            </div>
          </div>
        )}

        {/* Pricing */}
        {booking.hourlyRate && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Rate:</span>
                <span className="font-medium">${booking.hourlyRate}/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">1 hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee (5%):</span>
                <span className="font-medium">${(booking.hourlyRate * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {booking.status === 'pending' && 'Waiting for professional confirmation'}
            {booking.status === 'confirmed' && 'Booking confirmed'}
            {booking.status === 'completed' && 'Service completed'}
            {booking.status === 'cancelled' && 'Booking cancelled'}
          </div>
          
          <div className="flex space-x-2">
            {/* Payment Button */}
            {booking.status === 'confirmed' && booking.paymentStatus !== 'paid' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                <FaCreditCard className="mr-2" />
                Pay Now
              </button>
            )}
            
            {/* Payment Success Indicator */}
            {booking.paymentStatus === 'paid' && (
              <div className="flex items-center px-3 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded">
                <FaCheckCircle className="mr-2" />
                Payment Complete
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        booking={booking}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default CustomerBookingCard;
