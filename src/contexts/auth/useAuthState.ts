
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// Import the main Database type instead of the manual Profile type
import { Database } from '@/types/database';

// Define Profile type based on the auto-generated Supabase types
type Profile = Database['public']['Tables']['profiles']['Row'];

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // This now uses the derived Profile type
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get the current session
    const getCurrentSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);

        // Fetch the user profile if we have a user
        // Let onAuthStateChange handle setting isLoading to false after initial check
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
          // REMOVED setIsLoading(false) here
        } else {
          // If no user initially, we might still need to set loading false here
          // But onAuthStateChange should fire immediately after with null session,
          // handling the final isLoading=false state. Let's rely on that for consistency.
          // REMOVED setIsLoading(false) here
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        // If session fetch fails entirely, set loading false
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
          // fetchUserProfile sets isLoading=false in its finally block
          await fetchUserProfile(currentSession.user.id);
        } else {
          // No user in the new auth state, set profile null and loading false
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
      // Remove explicit type cast now that types should be correct
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single() as any; // Add type assertion

      if (error && error.code !== 'PGRST116') { // PGRST116 = 0 rows found by .single(), not necessarily an error here
        console.error('Error fetching user profile:', error);
        setProfile(null); // Ensure profile is null on error
      } else if (data) {
        setProfile(data); // No need for 'as Profile' if types are correct
      } else {
        setProfile(null); // Explicitly set profile to null if no data and no error (PGRST116 case)
      }
    } catch (error) {
      console.error('Error in fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, session, profile, isLoading, setProfile };
};
