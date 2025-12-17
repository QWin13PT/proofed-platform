'use client';

/**
 * Authentication Context
 * Provides auth state to entire app
 */

import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/use-auth';

const AuthContext = createContext(null);

/**
 * Auth provider component
 */
export function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 * @returns {Object} Auth state and methods
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  
  return context;
}

