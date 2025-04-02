
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // We use any here to avoid TypeScript errors with the Supabase client
      // The actual Profile type is enforced when we construct the profileData object
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() as { data: any, error: any };

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        // Explicitly convert to our Profile type
        const profileData: Profile = {
          id: data.id,
          username: data.username,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          is_tourist: data.is_tourist,
          stay_duration: data.stay_duration,
          dietary_preferences: data.dietary_preferences,
          interests: data.interests
        };
        
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return { user, session, profile, setProfile, isLoading };
};
