import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for worker authentication with mock fallback
 * Centralizes the mock user logic used across worker components
 */
export const useWorkerAuth = () => {
  const { user: authUser } = useAuth();
  
  // Mock user for testing when not authenticated
  const user = useMemo(() => authUser || {
    uid: 'HAvFzlKF2KbO5SplMANPACpAflL2', // Alessandro's user ID for testing
    email: 'alessandropoggio@gmail.com',
    displayName: 'Alessandro Poggio'
  }, [authUser]);

  return { user, isAuthenticated: !!authUser };
};
