import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Automatically creates a customer entry when certain booking milestones are reached
 * @param {Object} bookingData - The booking data
 * @param {string} userId - The worker's user ID
 * @param {string} trigger - What triggered the client creation ('quote_accepted', 'payment_completed', etc.)
 * @returns {Promise<{success: boolean, existed?: boolean, id?: string, error?: string}>}
 */
export const createCustomerFromBooking = async (bookingData, userId, trigger = 'quote_accepted') => {
  try {
    // Extract customer information from booking data
    const customerName = bookingData.customerName || bookingData.contactName || 'Unknown Customer';
    const customerEmail = bookingData.customerEmail || bookingData.email || '';
    
    // Check if customer already exists (only if email is provided)
    if (customerEmail && customerEmail.trim() !== '') {
      const existingCustomerQuery = query(
        collection(db, 'customers'),
        where('userId', '==', userId),
        where('email', '==', customerEmail)
      );
      
      const existingCustomers = await getDocs(existingCustomerQuery);
      
      if (!existingCustomers.empty) {
        return { success: true, existed: true, id: existingCustomers.docs[0].id };
      }
    }

    // Create new customer entry
    const customerData = {
      name: customerName,
      email: customerEmail,
      phone: bookingData.phone || bookingData.customerPhone || '',
      company: '', // Could be extracted from booking if available
      address: bookingData.address || '',
      notes: `Auto-created from ${trigger} - ${bookingData.serviceType} booking on ${new Date(bookingData.createdAt).toLocaleDateString()}`,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'booking', // Track how this customer was created
      originalBookingId: bookingData.id,
      createdFrom: trigger
    };

    const docRef = await addDoc(collection(db, 'customers'), customerData);
    
    return { success: true, existed: false, id: docRef.id };
    
  } catch (error) {
    console.error('Error auto-creating customer:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Hook this function into the booking status update process
 */
export const handleBookingStatusChange = async (bookingData, newStatus, userId) => {
  // Auto-create customer when quote is accepted
  if (newStatus === 'quote_accepted') {
    await createCustomerFromBooking(bookingData, userId, 'quote_accepted');
  }
  
  // Auto-create customer when payment is completed (backup)
  if (bookingData.paymentStatus === 'paid' && newStatus === 'confirmed') {
    await createCustomerFromBooking(bookingData, userId, 'payment_completed');
  }
};