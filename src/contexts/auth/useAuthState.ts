
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
      
      // Select specific columns matching the Profile type
      const { data, error } = await supabase
        .from('profiles')
        .select('id, created_at, updated_at, username, full_name, dietary_preferences, interests, stay_duration, is_tourist')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = 0 rows found by .single()
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } else if (data) {
        // Cast here if needed to ensure data matches Profile structure
        setProfile(data as Profile);
        
        // If this is a new user from OAuth (like Google), create a profile if it doesn't exist
        if (error && error.code === 'PGRST116') {
          console.log('Profile not found for user, creating one...');
          await createInitialProfile(userId);
        }
      } else {
        // Handle case where profile doesn't exist or other null data
        console.log('No profile found, user may need to create one');
        await createInitialProfile(userId);
      }
    } catch (error) {
      console.error('Error in fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create an initial profile for users who sign in with OAuth providers
  const createInitialProfile = async (userId: string) => {
    try {
      // Get user details from auth.users
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData || !userData.user) {
        console.error('Could not get user data for profile creation');
        return;
      }
      
      // Prepare a basic profile from available data
      const initialProfile = {
        id: userId,
        full_name: userData.user.user_metadata?.full_name || 
                   userData.user.user_metadata?.name || 
                   'User',
        username: null,
        // Default values for a new user
        is_tourist: true,
        interests: null,
        dietary_preferences: null,
        stay_duration: null
      };

      // Insert the profile
      const { error } = await supabase
        .from('profiles')
        .insert(initialProfile);

      if (error) {
        console.error('Error creating initial profile:', error);
        return;
      }

      // Set the profile in state
      setProfile(initialProfile as Profile);
      console.log('Created initial profile for user');
      
    } catch (error) {
      console.error('Error creating initial profile:', error);
    }
  };

  return { user, session, profile, isLoading, setProfile };
};
