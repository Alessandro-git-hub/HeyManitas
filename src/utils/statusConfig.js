/**
 * Centralized status configuration for jobs and bookings
 * This ensures consistency across the application
 */

// Booking status constants (lowercase - as stored in database)
export const BOOKING_STATUSES = {
  PENDING: 'pending',
  QUOTED: 'quoted',
  QUOTE_ACCEPTED: 'quote_accepted',
  QUOTE_DECLINED: 'quote_declined',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DECLINED: 'declined'
};

// Job status constants (normalized - as displayed in UI)
export const JOB_STATUSES = {
  PENDING: 'Pending',
  QUOTED: 'Quoted',
  QUOTE_ACCEPTED: 'Quote Accepted',
  QUOTE_DECLINED: 'Quote Declined',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DECLINED: 'Declined'
};

// Payment status constants
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
};

// Booking status to job status mapping
export const BOOKING_STATUS_MAPPING = {
  [BOOKING_STATUSES.PENDING]: JOB_STATUSES.PENDING,
  [BOOKING_STATUSES.QUOTED]: JOB_STATUSES.QUOTED,
  [BOOKING_STATUSES.QUOTE_ACCEPTED]: JOB_STATUSES.QUOTE_ACCEPTED,
  [BOOKING_STATUSES.QUOTE_DECLINED]: JOB_STATUSES.QUOTE_DECLINED,
  [BOOKING_STATUSES.CONFIRMED]: JOB_STATUSES.CONFIRMED,
  [BOOKING_STATUSES.COMPLETED]: JOB_STATUSES.COMPLETED,
  [BOOKING_STATUSES.CANCELLED]: JOB_STATUSES.CANCELLED,
  [BOOKING_STATUSES.DECLINED]: JOB_STATUSES.DECLINED
};

// Status priority order for sorting
export const STATUS_ORDER = {
  [JOB_STATUSES.PENDING]: 1,
  [JOB_STATUSES.QUOTED]: 2,
  [JOB_STATUSES.QUOTE_ACCEPTED]: 3,
  [JOB_STATUSES.CONFIRMED]: 4,
  [JOB_STATUSES.COMPLETED]: 5,
  [JOB_STATUSES.QUOTE_DECLINED]: 6,
  [JOB_STATUSES.DECLINED]: 7,
  [JOB_STATUSES.CANCELLED]: 8
};

// Status options for filter dropdown
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: JOB_STATUSES.PENDING, label: 'Pending' },
  { value: JOB_STATUSES.QUOTED, label: 'Quoted' },
  { value: JOB_STATUSES.QUOTE_ACCEPTED, label: 'Quote Accepted' },
  { value: JOB_STATUSES.QUOTE_DECLINED, label: 'Quote Declined' },
  { value: JOB_STATUSES.CONFIRMED, label: 'Confirmed' },
  { value: JOB_STATUSES.COMPLETED, label: 'Completed' },
  { value: JOB_STATUSES.CANCELLED, label: 'Cancelled' },
  { value: JOB_STATUSES.DECLINED, label: 'Declined' }
];

// Date filter options for filter dropdown
export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' }
];

// Sort options for filter dropdown
export const SORT_OPTIONS = [
  { value: 'date-newest', label: 'Date (Newest)' },
  { value: 'date-oldest', label: 'Date (Oldest)' },
  { value: 'status', label: 'Status' },
  { value: 'client', label: 'Client Name' }
];

/**
 * Maps booking status to normalized job status
 * @param {string} bookingStatus - Original booking status
 * @returns {string} Normalized job status
 */
export const mapBookingStatusToJobStatus = (bookingStatus) => {
  if (!bookingStatus) return JOB_STATUSES.PENDING;
  return BOOKING_STATUS_MAPPING[bookingStatus] || JOB_STATUSES.PENDING;
};

/**
 * Ensures an item has a valid status
 * @param {Object} item - Job or booking item
 * @returns {string} Valid status
 */
export const normalizeItemStatus = (item) => {
  if (item.itemType === 'booking') {
    return mapBookingStatusToJobStatus(item.status);
  }
  return item.status || JOB_STATUSES.PENDING;
};
