
import { createContext } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { Profile } from '@/types/database';
import { AuthResult, ProfileFormValues } from './useAuthMethods';

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, userData: any) => Promise<AuthResult>;
  signInWithProvider: (provider: Provider) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  updateProfile: (userId: string, data: ProfileFormValues) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isSigningIn: false,
  isSigningUp: false,
  isSigningOut: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signInWithProvider: async () => ({ success: false }),
  signOut: async () => ({ success: false }),
  updateProfile: async () => false,
});
