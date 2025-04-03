
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';

export type AuthState = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
};

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to auth changes
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      
      console.log('Auth state changed:', event, !!session?.user);
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    // Initial auth check
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      } else {
        // If no profile exists, create one
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Create a new user profile
  const createUserProfile = async (userId: string) => {
    try {
      const newProfile: Partial<Profile> = {
        id: userId,
        full_name: user?.user_metadata?.full_name || null,
      };

      const { error } = await supabase
        .from('profiles')
        .insert([newProfile]);

      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      // Fetch the newly created profile
      await fetchUserProfile(userId);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  return { user, profile, isLoading, setProfile };
};
