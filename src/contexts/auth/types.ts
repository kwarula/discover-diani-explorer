import { createContext } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signInWithProvider: (provider: Provider) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isSigningIn: false,
  isSigningUp: false,
  isSigningOut: false,
  signIn: async () => null,
  signUp: async () => null,
  signInWithProvider: async () => null, 
  signOut: async () => {},
  updateProfile: async () => {},
});
