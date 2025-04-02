
import { createContext } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
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
  signOut: async () => {},
  updateProfile: async () => {},
});
