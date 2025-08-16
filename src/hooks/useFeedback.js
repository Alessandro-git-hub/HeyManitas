import { useState } from 'react';

/**
 * Hook for consistent feedback message handling
 * 
 * Returns state and methods for managing feedback messages
 * that integrate seamlessly with WorkerLayout
 */
export function useFeedback() {
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const showSuccess = (message) => {
    setFeedback({ message, type: 'success' });
  };

  const showError = (message) => {
    setFeedback({ message, type: 'error' });
  };

  const clearFeedback = () => {
    setFeedback({ message: '', type: '' });
  };

  return {
    feedback,
    showSuccess,
    showError,
    clearFeedback
  };
}
