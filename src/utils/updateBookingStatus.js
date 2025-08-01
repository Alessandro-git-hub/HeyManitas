import { doc, updateDoc, addDoc, collection, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Updates a booking's status and handles status transitions
 * @param {string} bookingId - The ID of the booking to update
 * @param {string} newStatus - The new status ('confirmed', 'in-progress', 'completed', 'cancelled')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    // Special handling for 'confirmed' status - this converts booking to job
    if (newStatus === 'confirmed') {
      // Get the booking data first
      const bookingSnapshot = await getDoc(bookingRef);
      if (!bookingSnapshot.exists()) {
        throw new Error('Booking not found');
      }
      
      const bookingData = bookingSnapshot.data();
      
      // Create a new job from the confirmed booking
      const jobData = {
        title: bookingData.service || 'Service Request',
        description: bookingData.notes || '',
        clientName: bookingData.customerName,
        clientEmail: bookingData.customerEmail,
        clientPhone: bookingData.customerPhone || '',
        status: 'Pending', // Start as pending job
        scheduledDate: bookingData.date,
        scheduledTime: bookingData.time,
        duration: bookingData.duration || '1 hour',
        price: bookingData.price || 0,
        location: bookingData.location || '',
        professionalId: bookingData.professionalId,
        createdAt: new Date(),
        updatedAt: new Date(),
        originalBookingId: bookingId
      };
      
      // Add the new job
      await addDoc(collection(db, 'jobs'), jobData);
      
      // Update booking status to confirmed
      await updateDoc(bookingRef, {
        status: 'confirmed',
        updatedAt: new Date(),
        confirmedAt: new Date()
      });
      
      return { success: true };
    }
    
    // For other status updates, just update the booking
    const updateData = {
      status: newStatus,
      updatedAt: new Date()
    };
    
    // Add timestamp for specific status changes
    switch (newStatus) {
      case 'cancelled':
        updateData.cancelledAt = new Date();
        break;
      case 'completed':
        updateData.completedAt = new Date();
        break;
      case 'in-progress':
        updateData.startedAt = new Date();
        break;
      default:
        break;
    }
    
    await updateDoc(bookingRef, updateData);
    
    return { success: true };
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update booking status' 
    };
  }
};

/**
 * Deletes a booking completely
 * @param {string} bookingId - The ID of the booking to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteBooking = async (bookingId) => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete booking' 
    };
  }
};
