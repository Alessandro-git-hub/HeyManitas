/**
 * Utility functions for extracting and formatting job/booking data
 */

/**
 * Safely gets the first available value from multiple possible field names
 */
export const getFirstAvailable = (...values) => {
  return values.find(value => value && value !== 'Not specified') || null;
};

/**
 * Extracts customer information from job/booking object
 */
export const extractCustomerInfo = (job) => {
  return {
    name: getFirstAvailable(job.clientName, job.client, job.customerName, job.customerEmail),
    email: getFirstAvailable(job.customerEmail, job.clientEmail),
    phone: getFirstAvailable(job.customerPhone, job.clientPhone, job.phone)
  };
};

/**
 * Extracts service information from job/booking object
 */
export const extractServiceInfo = (job) => {
  const isBooking = job.itemType === 'booking';
  
  return {
    name: getFirstAvailable(job.serviceName, job.serviceType),
    description: getFirstAvailable(job.description, job.notes),
    basePrice: job.basePrice,
    budget: isBooking ? job.budget : null,
    finalPrice: isBooking 
      ? (job.hourlyRate ? `€${job.hourlyRate}/hour` : null)
      : getFirstAvailable(job.finalPrice, job.price),
    serviceId: job.serviceId,
    duration: isBooking ? job.duration : null,
    location: isBooking ? getFirstAvailable(job.address, job.location) : null
  };
};

/**
 * Extracts scheduling information from job/booking object
 */
export const extractSchedulingInfo = (job) => {
  const isBooking = job.itemType === 'booking';
  
  return {
    scheduledDate: getFirstAvailable(job.scheduledDate, job.date),
    scheduledTime: getFirstAvailable(job.scheduledTime, job.time),
    originalDateTime: isBooking ? job.datetime : null
  };
};

/**
 * Extracts system information from job/booking object
 */
export const extractSystemInfo = (job) => {
  const isBooking = job.itemType === 'booking';
  
  return {
    id: job.id,
    type: isBooking ? 'Booking Request' : 'Job',
    created: job.createdAt,
    originalBookingId: job.originalBookingId
  };
};

/**
 * Formats time safely
 */
export const formatTimeValue = (time) => {
  return time || 'Not specified';
};
