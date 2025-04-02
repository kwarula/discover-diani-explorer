
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}
