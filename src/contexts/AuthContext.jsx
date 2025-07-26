import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            ...userData
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, userData = {}) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      if (userData.displayName) {
        await updateProfile(firebaseUser, {
          displayName: userData.displayName
        });
      }

      // Save additional user data to Firestore
      const userDocData = {
        email: firebaseUser.email,
        displayName: userData.displayName || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        profession: userData.profession || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);
      
      return firebaseUser;
    } catch (error) {
      console.error('Signup error details:', error);
      
      // Add specific handling for configuration errors
      if (error.code === 'auth/configuration-not-found') {
        throw new Error('Firebase Authentication is not configured. Please enable Authentication in Firebase Console.');
      }
      
      throw error; // Re-throw other errors
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error details:', error);
      
      // Add specific handling for configuration errors
      if (error.code === 'auth/configuration-not-found') {
        throw new Error('Firebase Authentication is not configured. Please enable Authentication in Firebase Console.');
      }
      
      throw error; // Re-throw other errors
    }
  };

  const logout = async () => {
    return await signOut(auth);
  };

  const updateUserProfile = async (userData) => {
    if (!user) return;

    // Update Firebase Auth profile if displayName changed
    if (userData.displayName !== user.displayName) {
      await updateProfile(auth.currentUser, {
        displayName: userData.displayName
      });
    }

    // Update Firestore document
    const updateData = {
      ...userData,
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });
    
    // Update local state
    setUser(prev => ({ ...prev, ...updateData }));
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
