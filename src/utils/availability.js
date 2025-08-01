import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Set default availability for a professional
export const setDefaultAvailability = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Generate availability for the next 30 days
    const availability = {};
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Skip weekends for this example
      if (date.getDay() === 0 || date.getDay() === 6) {
        availability[dateString] = []; // No availability on weekends
      } else {
        // Available 9 AM to 6 PM on weekdays
        availability[dateString] = [
          '09:00', '10:00', '11:00', '12:00',
          '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];
      }
    }
    
    await updateDoc(userRef, { availability });
    return { success: true };
  } catch (error) {
    console.error('Error setting availability:', error);
    return { success: false, error: error.message };
  }
};

// Update specific day availability
export const updateDayAvailability = async (userId, date, timeSlots) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const availability = userData.availability || {};
      availability[date] = timeSlots;
      
      await updateDoc(userRef, { availability });
      return { success: true };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error updating availability:', error);
    return { success: false, error: error.message };
  }
};

// Get professional's availability for a specific date
export const getProfessionalAvailability = async (userId, date) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const availability = userData.availability || {};
      return { 
        success: true, 
        timeSlots: availability[date] || [] 
      };
    } else {
      return { success: false, error: 'User not found', timeSlots: [] };
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
    return { success: false, error: error.message, timeSlots: [] };
  }
};
