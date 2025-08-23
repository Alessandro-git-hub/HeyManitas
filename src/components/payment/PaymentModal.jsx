import React, { useState } from 'react';
import Modal from '../common/Modal';
import LoadingState from '../common/LoadingState';
import PaymentForm from './PaymentForm';
import { updateDoc, doc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../utils/firebase';

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
  // Use quotedPrice if available (after quote acceptance), otherwise use hourlyRate
  const serviceAmount = booking.quotedPrice || booking.finalPrice || booking.hourlyRate || 0;
  const serviceFee = serviceAmount * 0.05;
  const totalAmount = serviceAmount + serviceFee;

    const handlePaymentSuccess = async (paymentData) => {
    setPaymentStep('processing');
    
    try {
      // Update booking with payment information and status
      const bookingRef = doc(db, 'bookings', booking.id);
      const updateData = {
        paymentStatus: 'paid',
        paymentMethod: paymentData.paymentMethodId,
        amountPaid: totalAmount,
        paidAt: new Date().toISOString(),
        status: 'confirmed', // Update status from quote_accepted to confirmed
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(bookingRef, updateData);

      // Create corresponding job for the worker (if not already exists)
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('originalBookingId', '==', booking.id)
      );
      const existingJobs = await getDocs(jobsQuery);
      
      if (existingJobs.empty) {
        // Create new job entry for the worker
        const jobData = {
          title: booking.serviceType || 'Service Request',
          description: booking.description || `${booking.serviceType} service for ${booking.customerName}`,
          clientName: booking.customerName,
          clientEmail: booking.customerEmail,
          clientPhone: booking.customerPhone,
          status: 'Pending', // Job starts as Pending until worker marks in progress
          scheduledDate: booking.date,
          scheduledTime: booking.time,
          duration: booking.duration || '1 hour',
          price: totalAmount,
          finalPrice: totalAmount,
          location: booking.address,
          userId: booking.professionalId, // Worker's ID
          professionalId: booking.professionalId,
          originalBookingId: booking.id,
          paymentConfirmed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, 'jobs'), jobData);
      }

      // Create customer calendar entry
      const customerCalendarData = {
        userId: auth.currentUser?.uid,
        customerId: auth.currentUser?.uid,
        customerEmail: booking.customerEmail,
        bookingId: booking.id,
        title: `${booking.serviceType} - ${booking.professionalName}`,
        description: booking.description,
        serviceType: booking.serviceType,
        professionalName: booking.professionalName,
        professionalId: booking.professionalId,
        date: booking.date,
        time: booking.time,
        duration: booking.duration || '1 hour',
        location: booking.address,
        status: 'scheduled',
        amountPaid: totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        await addDoc(collection(db, 'customerCalendar'), customerCalendarData);
      } catch (calendarError) {
        console.error('Error creating calendar entry:', calendarError);
        // Continue with payment flow even if calendar fails
      }

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

  const getModalTitle = () => {
    switch (paymentStep) {
      case 'form': return 'Complete Payment';
      case 'processing': return 'Processing Payment';
      case 'success': return 'Payment Complete';
      case 'error': return 'Payment Failed';
      default: return 'Payment';
    }
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
          <LoadingState 
            size="lg"
            text="Processing your payment... Please don't close this window."
          />
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
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
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
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      size="md"
      preventClose={paymentStep === 'processing'}
      closeOnEscape={paymentStep !== 'processing'}
      closeOnOverlay={paymentStep !== 'processing'}
    >
      {renderContent()}
    </Modal>
  );
};

export default PaymentModal;
