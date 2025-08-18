import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    console.log('Creating booking with data:', bookingData);
    
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Booking created successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: error.message };
  }
};

// Get bookings for a specific professional on a specific date
export const getProfessionalBookings = async (professionalId, date) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('professionalId', '==', professionalId),
      where('date', '==', date),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, bookings };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, error: error.message, bookings: [] };
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { success: false, error: error.message };
  }
};

// Check if a time slot is available
export const isTimeSlotAvailable = async (professionalId, date, time) => {
  const { success, bookings } = await getProfessionalBookings(professionalId, date);
  if (!success) return false;
  
  return !bookings.some(booking => booking.time === time);
};
