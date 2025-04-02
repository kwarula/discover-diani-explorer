
import React, { createContext } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, profile, setProfile, isLoading } = useAuthState();
  const { signIn, signUp, signOut, updateProfile } = useAuthMethods(user, setProfile);

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
