import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { createCustomerFromBooking } from '../utils/customerAutomation';

/**
 * Service for handling booking-related operations
 * Centralizes business logic for bookings, quotes, and customer creation
 */

/**
 * Handle quote response (accept or decline)
 * @param {string} bookingId - The booking/quote ID
 * @param {string} action - 'accept' or 'decline'
 * @param {Object} bookingData - The full booking data object
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const handleQuoteResponse = async (bookingId, action, bookingData) => {
  try {
    const newStatus = action === 'accept' ? 'quote_accepted' : 'quote_declined';
    const bookingRef = doc(db, 'bookings', bookingId);
    
    // Update booking status
    await updateDoc(bookingRef, {
      status: newStatus,
      customerResponse: action === 'accept' 
        ? 'Quote accepted by customer' 
        : 'Quote declined by customer',
      respondedAt: Timestamp.now(),
      ...(action === 'accept' && { 
        finalPrice: bookingData.quotedPrice,
        paymentStatus: 'pending'
      })
    });

    // If quote was accepted, automatically create customer entry for the worker
    if (action === 'accept' && bookingData.professionalId) {
      const result = await createCustomerFromBooking(
        bookingData, 
        bookingData.professionalId, 
        'quote_accepted'
      );
      
      if (!result.success) {
        console.warn('Customer creation failed but quote was accepted:', result.error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling quote response:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Accept a quote
 * @param {string} bookingId - The booking/quote ID
 * @param {Object} bookingData - The full booking data object
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const acceptQuote = async (bookingId, bookingData) => {
  return handleQuoteResponse(bookingId, 'accept', bookingData);
};

/**
 * Decline a quote
 * @param {string} bookingId - The booking/quote ID
 * @param {Object} bookingData - The full booking data object
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const declineQuote = async (bookingId, bookingData) => {
  return handleQuoteResponse(bookingId, 'decline', bookingData);
};
