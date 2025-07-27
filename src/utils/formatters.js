// Shared utility functions for formatting data across the application

/**
 * Get status-specific CSS classes for job statuses
 * @param {string} status - The job status
 * @param {boolean} includeBorder - Whether to include border classes
 * @returns {string} CSS classes for styling
 */
export const getStatusStyles = (status, includeBorder = false) => {
  switch (status) {
    case 'Done':
      return `bg-green-100 text-green-800${includeBorder ? ' border-green-200' : ''}`;
    case 'In Progress':
      return `bg-blue-100 text-blue-800${includeBorder ? ' border-blue-200' : ''}`;
    case 'Cancelled':
      return `bg-red-100 text-red-800${includeBorder ? ' border-red-200' : ''}`;
    default: // Pending
      return `bg-yellow-100 text-yellow-800${includeBorder ? ' border-yellow-200' : ''}`;
  }
};

/**
 * Format a date for display (short format)
 * @param {Date|Timestamp|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return dateObj.toLocaleDateString();
};

/**
 * Format a date for display (month and day only)
 * @param {Date|Timestamp|string} date - The date to format
 * @returns {string} Formatted date string (e.g., "Jan 15")
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format a date and time for display
 * @param {Date|Timestamp|string} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a date and time for detailed display (with weekday)
 * @param {Date|Timestamp|string} date - The date to format
 * @returns {string} Formatted date and time string with weekday
 */
export const formatDateTimeDetailed = (date) => {
  if (!date) return 'Not specified';
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return dateObj.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a date for detailed display (with weekday)
 * @param {Date|Timestamp|string} date - The date to format
 * @returns {string} Formatted date string with weekday
 */
export const formatDateDetailed = (date) => {
  if (!date) return 'Not specified';
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
