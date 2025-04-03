
import React from 'react';
import { AuthContext } from './types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    profile, 
    isLoading,
    setProfile
  } = useAuthState();
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    signInWithProvider,
    isSigningIn,
    isSigningUp,
    isSigningOut
  } = useAuthMethods(setProfile);

  const value = {
    user,
    profile,
    isLoading,
    isSigningIn,
    isSigningUp,
    isSigningOut,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
