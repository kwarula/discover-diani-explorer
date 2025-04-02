
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get the current session
    const getCurrentSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // Fetch the user profile if we have a user
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setIsLoading(false);
      }
    };

    getCurrentSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // Fetch the profile when auth state changes and we have a user
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to fetch user profile from 'profiles' table
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      // Type assertion to any as a workaround
      const { data, error } = await (supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single() as any);

      if (error) {
        console.error('Error fetching user profile:', error);
      } else if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error in fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, session, profile, isLoading, setProfile };
};
