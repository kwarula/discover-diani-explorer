
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
    // Set up auth state listener FIRST - important for preventing auth deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // Fetch the profile when auth state changes and we have a user
        // Use setTimeout to avoid potential Supabase auth deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          // No user in the new auth state, set profile null and loading false
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to fetch user profile from 'profiles' table
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single() as { data: Profile | null, error: any };

      if (error && error.code !== 'PGRST116') { // PGRST116 = 0 rows found by .single()
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } else if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error in fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, session, profile, isLoading, setProfile };
};
