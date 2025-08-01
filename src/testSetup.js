import { setDefaultAvailability } from './utils/availability';

// Helper function to set up test data - can be called from browser console
window.setupTestAvailability = async () => {
  try {
    // Alessandro Poggio's user ID (you can get this from Firebase console)
    const alessandroUserId = 'alessandropoggio@gmail.com'; // or actual user ID
    
    const result = await setDefaultAvailability(alessandroUserId);
    if (result.success) {
      console.log('✅ Default availability set for Alessandro Poggio');
    } else {
      console.error('❌ Failed to set availability:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

console.log('📅 Calendar test setup loaded. Run setupTestAvailability() to initialize professional availability.');
