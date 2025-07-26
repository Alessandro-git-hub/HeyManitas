// Test script to verify Firestore integration
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const testServicesIntegration = async () => {
  try {
    console.log('🔥 Testing Firestore services integration...');
    
    // Test fetching services
    const querySnapshot = await getDocs(collection(db, 'services'));
    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`✅ Successfully fetched ${services.length} services from Firestore:`, services);
    
    // Test adding a service
    const testService = {
      name: 'Test Integration Service',
      description: 'This service was created to test Firestore integration',
      category: 'Other',
      basePrice: 50,
      duration: '1 hour',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'services'), testService);
    console.log('✅ Successfully added test service with ID:', docRef.id);
    
    return {
      success: true,
      servicesCount: services.length,
      testServiceId: docRef.id
    };
    
  } catch (error) {
    console.error('❌ Firestore integration test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testJobsIntegration = async () => {
  try {
    console.log('🔥 Testing Firestore jobs integration...');
    
    // Test fetching jobs
    const querySnapshot = await getDocs(collection(db, 'jobs'));
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`✅ Successfully fetched ${jobs.length} jobs from Firestore:`, jobs);
    
    return {
      success: true,
      jobsCount: jobs.length
    };
    
  } catch (error) {
    console.error('❌ Jobs integration test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
