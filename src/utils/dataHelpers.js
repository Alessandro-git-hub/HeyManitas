import { mapBookingStatusToJobStatus, JOB_STATUSES } from './statusConfig';

/**
 * Normalizes booking data to job-like structure for consistent handling
 * @param {Object} bookingData - Raw booking data from Firestore
 * @param {string} docId - Document ID
 * @returns {Object} Normalized booking object
 */
export const normalizeBookingData = (bookingData, docId) => {
  return {
    id: docId,
    itemType: 'booking',
    // Keep original booking data first
    ...bookingData,
    // Then override with job-like structure for consistency
    client: bookingData.customerEmail,
    description: bookingData.description || `${bookingData.serviceType} service request`,
    serviceName: bookingData.serviceType,
    status: mapBookingStatusToJobStatus(bookingData.status),
    scheduledDate: bookingData.date,
    finalPrice: bookingData.hourlyRate,
    createdAt: bookingData.createdAt,
    // Keep original booking data reference
    originalBooking: bookingData
  };
};

/**
 * Normalizes job data to ensure consistent structure
 * @param {Object} jobData - Raw job data from Firestore
 * @param {string} docId - Document ID
 * @returns {Object} Normalized job object
 */
export const normalizeJobData = (jobData, docId) => {
  return {
    id: docId,
    itemType: 'job',
    ...jobData,
    // Ensure job has a valid status
    status: jobData.status || JOB_STATUSES.PENDING
  };
};

/**
 * Sorts items by status priority and creation date
 * @param {Array} items - Array of job/booking items
 * @param {Object} statusOrder - Status priority mapping
 * @returns {Array} Sorted array
 */
export const sortItemsByStatusAndDate = (items, statusOrder) => {
  return items.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // Sort by creation date (newest first)
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB - dateA;
  });
};
