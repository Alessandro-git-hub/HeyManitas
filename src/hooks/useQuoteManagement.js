import { useState, useCallback } from 'react';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

export const useQuoteManagement = (bookingRequests, fetchBookingRequests) => {
  const [activeQuoteId, setActiveQuoteId] = useState(null);
  const [quoteForms, setQuoteForms] = useState({});

  const getQuoteForm = useCallback((quoteId) => {
    return quoteForms[quoteId] || {
      quotedPrice: '',
      message: '',
      validUntil: ''
    };
  }, [quoteForms]);

  const updateQuoteForm = useCallback((quoteId, updates) => {
    setQuoteForms(prev => ({
      ...prev,
      [quoteId]: {
        ...getQuoteForm(quoteId),
        ...updates
      }
    }));
  }, [getQuoteForm]);

  const clearQuoteForm = useCallback((quoteId) => {
    setQuoteForms(prev => {
      const newForms = { ...prev };
      delete newForms[quoteId];
      return newForms;
    });
  }, []);

  const toggleQuote = useCallback((quoteId, hourlyRate) => {
    setActiveQuoteId(quoteId);
    updateQuoteForm(quoteId, { 
      quotedPrice: hourlyRate?.toString() || '', 
      message: '', 
      validUntil: '' 
    });
  }, [updateQuoteForm]);

  const cancelQuote = useCallback((quoteId) => {
    setActiveQuoteId(null);
    clearQuoteForm(quoteId);
  }, [clearQuoteForm]);

  const submitQuote = useCallback(async (bookingId, showFeedback) => {
    try {
      const quoteForm = getQuoteForm(bookingId);
      const quotedPrice = parseFloat(quoteForm.quotedPrice);
      
      if (!quotedPrice || quotedPrice <= 0) {
        showFeedback('Please enter a valid quote amount.', 'error');
        return;
      }

      if (!quoteForm.message.trim()) {
        showFeedback('Please provide a message with your quote.', 'error');
        return;
      }

      // Calculate default expiry (7 days from now)
      const validUntil = quoteForm.validUntil 
        ? new Date(quoteForm.validUntil)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Get the booking to check its current data
      const booking = bookingRequests.find(b => b.id === bookingId);

      // Update the booking with quote information
      const updateData = {
        status: 'quoted',
        quotedPrice: quotedPrice,
        originalPrice: booking?.hourlyRate,
        workerQuoteMessage: quoteForm.message.trim(),
        quotedAt: Timestamp.now(),
        quoteExpiresAt: Timestamp.fromDate(validUntil)
      };
      
      await updateDoc(doc(db, 'bookings', bookingId), updateData);

      showFeedback('Quote sent successfully!', 'success');
      setActiveQuoteId(null);
      clearQuoteForm(bookingId);
      
      // Refresh the list
      fetchBookingRequests();
      
    } catch (error) {
      console.error('Error sending quote:', error);
      showFeedback('Error sending quote. Please try again.', 'error');
    }
  }, [getQuoteForm, bookingRequests, clearQuoteForm, fetchBookingRequests]);

  const declineRequest = useCallback(async (bookingId, showFeedback) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'declined',
        declinedAt: Timestamp.now()
      });
      
      showFeedback('Booking request declined.', 'success');
      fetchBookingRequests();
      
    } catch (error) {
      console.error('Error declining request:', error);
      showFeedback('Error declining request. Please try again.', 'error');
    }
  }, [fetchBookingRequests]);

  return {
    activeQuoteId,
    quoteForms,
    getQuoteForm,
    updateQuoteForm,
    toggleQuote,
    cancelQuote,
    submitQuote,
    declineRequest
  };
};