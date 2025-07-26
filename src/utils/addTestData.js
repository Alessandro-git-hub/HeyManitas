import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase.js';

export const addTestJobs = async () => {
  try {
    const testJobs = [
      {
        client: 'Mario Pérez',
        description: 'Install 3 outlet sockets in kitchen',
        status: 'Pending',
      },
      {
        client: 'Ana López',
        description: 'Repair living room light fixture',
        status: 'Done',
      },
      {
        client: 'Carlos García',
        description: 'Replace bathroom faucet',
        status: 'Pending',
      },
    ];

    for (const job of testJobs) {
      const docRef = await addDoc(collection(db, 'jobs'), job);
      console.log('Document written with ID: ', docRef.id);
    }
    
    console.log('All test jobs added successfully!');
  } catch (error) {
    console.error('Error adding test jobs: ', error);
  }
};
