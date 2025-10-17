import React, { useState } from 'react';
import { FaCalendar, FaClock, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaTimes, FaCheck } from 'react-icons/fa';
import PaymentModal from '../payment/PaymentModal';
import { useQuoteResponse } from '../../hooks/useQuoteResponse';

const CustomerBookingCard = ({ booking, onPaymentComplete }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isUpdating, acceptQuote, declineQuote } = useQuoteResponse();

  const handleQuoteResponse = async (action) => {
    const onSuccess = () => {
      window.location.reload();
    };

    const onError = (error) => {
      console.error('Error responding to quote:', error);
      alert('Error updating quote response. Please try again.');
    };

    if (action === 'accept') {
      await acceptQuote(booking.id, booking, onSuccess, onError);
    } else {
      await declineQuote(booking.id, booking, onSuccess, onError);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quoted':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'quote_accepted':
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'quote_declined':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Waiting for Quote';
      case 'quoted':
        return 'Quote Received';
      case 'quote_accepted':
        return 'Quote Accepted';
      case 'quote_declined':
        return 'Quote Declined';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'declined':
        return 'Declined by Worker';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
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
              {getStatusText(booking.status)}
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
          <div className="flex items-center text-sm text-white">
            <FaCalendar className="mr-2 text-white" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center text-sm text-white">
            <FaClock className="mr-2 text-white" />
            <span>{formatTime(booking.time)}</span>
          </div>
        </div>

        {/* Service Details */}
        {booking.description && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Service Description:</h4>
            <p className="text-sm text-white">{booking.description}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {booking.customerEmail && (
            <div className="flex items-center text-sm text-white">
              <FaEnvelope className="mr-2 text-white" />
              <span className="truncate">{booking.customerEmail}</span>
            </div>
          )}
          {booking.phone && (
            <div className="flex items-center text-sm text-white">
              <FaPhone className="mr-2 text-white" />
              <span>{booking.phone}</span>
            </div>
          )}
        </div>

        {/* Address */}
        {booking.address && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-white">
              <FaMapMarkerAlt className="mr-2 text-white" />
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

        {/* Quote Display (if status is 'quoted') */}
        {booking.status === 'quoted' && booking.quotedPrice && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-primary-900 mb-2">Quote Received</h4>
            <div className="space-y-2">
              {booking.originalPrice && (
                <p className="text-sm text-gray-600">
                  Original Rate: <span className="line-through">€{booking.originalPrice}</span>
                </p>
              )}
              <p className="text-lg font-semibold text-primary-900">
                Quoted Price: €{booking.quotedPrice}
              </p>
              {booking.workerQuoteMessage && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Message from Professional:</p>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded border mt-1">
                    {booking.workerQuoteMessage}
                  </p>
                </div>
              )}
              {booking.quoteExpiresAt && (
                <p className="text-xs text-gray-500">
                  Valid until: {new Date(booking.quoteExpiresAt.seconds * 1000).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {booking.status === 'pending' && 'Waiting for professional quote'}
            {booking.status === 'quoted' && 'Quote received - please review'}
            {booking.status === 'quote_accepted' && 'Quote accepted - booking confirmed'}
            {booking.status === 'quote_declined' && 'Quote declined'}
            {booking.status === 'confirmed' && 'Booking confirmed'}
            {booking.status === 'completed' && 'Service completed'}
            {booking.status === 'cancelled' && 'Booking cancelled'}
            {booking.status === 'declined' && 'Request declined by professional'}
          </div>
          
          <div className="flex space-x-2">
            {/* Quote Response Buttons */}
            {booking.status === 'quoted' && (
              <>
                <button
                  onClick={() => handleQuoteResponse('decline')}
                  disabled={isUpdating}
                  className="flex items-center px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors disabled:opacity-50"
                >
                  <FaTimes className="mr-1" />
                  Decline
                </button>
                <button
                  onClick={() => handleQuoteResponse('accept')}
                  disabled={isUpdating}
                  className="flex items-center px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors disabled:opacity-50"
                >
                  <FaCheck className="mr-1" />
                  Accept Quote
                </button>
              </>
            )}
            
            {/* Payment Button */}
            {(booking.status === 'confirmed' || booking.status === 'quote_accepted') && booking.paymentStatus !== 'paid' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded transition-colors"
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
