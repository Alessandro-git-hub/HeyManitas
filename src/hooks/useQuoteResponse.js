import { useState, useCallback } from 'react';
import { acceptQuote, declineQuote } from '../services/bookingService';

/**
 * Custom hook for handling quote responses
 * Provides methods to accept/decline quotes with loading and error states
 * 
 * @returns {Object} Quote response handlers and state
 */
export const useQuoteResponse = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Accept a quote
   * @param {string} bookingId - The booking/quote ID
   * @param {Object} bookingData - The full booking data
   * @param {Function} onSuccess - Callback on successful acceptance
   * @param {Function} onError - Callback on error
   */
  const handleAcceptQuote = useCallback(async (bookingId, bookingData, onSuccess, onError) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await acceptQuote(bookingId, bookingData);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error);
        onError?.(result.error);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to accept quote';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Decline a quote
   * @param {string} bookingId - The booking/quote ID
   * @param {Object} bookingData - The full booking data
   * @param {Function} onSuccess - Callback on successful decline
   * @param {Function} onError - Callback on error
   */
  const handleDeclineQuote = useCallback(async (bookingId, bookingData, onSuccess, onError) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await declineQuote(bookingId, bookingData);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error);
        onError?.(result.error);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to decline quote';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    isUpdating,
    error,
    acceptQuote: handleAcceptQuote,
    declineQuote: handleDeclineQuote
  };
};
