import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import PaymentForm from './PaymentForm';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onPaymentComplete 
}) => {
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success', 'error'
  const [paymentResult, setPaymentResult] = useState(null);

  if (!isOpen || !booking) return null;

  // Calculate payment amount (service cost + 5% fee)
  const serviceAmount = booking.hourlyRate || 0;
  const serviceFee = serviceAmount * 0.05;
  const totalAmount = serviceAmount + serviceFee;

    const handlePaymentSuccess = async (paymentData) => {
    setPaymentStep('processing');
    
    try {
      // Update booking with payment information
      const bookingRef = doc(db, 'bookings', booking.id);
      const updateData = {
        paymentStatus: 'paid',
        paymentMethod: paymentData.paymentMethodId,
        amountPaid: totalAmount,
        paidAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(bookingRef, updateData);

      setPaymentResult({
        success: true,
        paymentId: paymentData.paymentMethodId,
        amount: totalAmount,
      });
      setPaymentStep('success');

      // Notify parent component
      onPaymentComplete?.(booking, paymentData);

    } catch (error) {
      console.error('Error updating payment status:', error);
      setPaymentResult({
        success: false,
        error: error.message,
      });
      setPaymentStep('error');
    }
  };

  const handlePaymentError = (error) => {
    setPaymentResult({
      success: false,
      error: error.message,
    });
    setPaymentStep('error');
  };

  const handleClose = () => {
    if (paymentStep === 'processing') return; // Don't allow closing during processing
    setPaymentStep('form');
    setPaymentResult(null);
    onClose();
  };

  const renderContent = () => {
    switch (paymentStep) {
      case 'form':
        return (
          <PaymentForm
            booking={booking}
            amount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Payment...
            </h3>
            <p className="text-gray-600">
              Please don't close this window while we process your payment.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed and payment processed.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">${paymentResult?.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{booking.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{booking.date} at {booking.time}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Close
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Failed
            </h3>
            <p className="text-gray-600 mb-4">
              {paymentResult?.error || 'Something went wrong with your payment.'}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setPaymentStep('form')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {paymentStep === 'form' ? 'Complete Payment' : 
             paymentStep === 'success' ? 'Payment Complete' :
             paymentStep === 'error' ? 'Payment Failed' : 'Processing...'}
          </h2>
          {paymentStep !== 'processing' && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
