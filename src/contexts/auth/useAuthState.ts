import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { toast } from 'sonner';
import { logError } from '@/utils/errorLogger';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to create an initial profile - returns success boolean
  const createInitialProfile = useCallback(async (userId: string): Promise<boolean> => {
    console.log('[createInitialProfile] Starting profile creation for user:', userId);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        const error = new Error('Could not get user data');
        logError(error, { context: 'createInitialProfile', user: userId });
        toast.error('Failed to create profile: User data not available');
        return false;
      }

      console.log('[createInitialProfile] User data retrieved:', userData.user.email);
      
      // Create initial profile with default fields that match our schema
      const initialProfileData = {
        id: userId,
        full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || 'User',
        username: null,
        avatar_url: null,
        bio: null,
        is_tourist: true,
        dietary_preferences: [],
        interests: [],
        stay_duration: null,
        role: 'user',
        status: 'active'
      };

      console.log('[createInitialProfile] Inserting profile with data:', initialProfileData);

      // Run health check on the database first - debug profile table schema
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);
          
        if (tableError) {
          console.error('[createInitialProfile] Table health check failed:', tableError);
        } else {
          console.log('[createInitialProfile] Table structure verified:', 
            Object.keys(tableInfo?.[0] || {}).join(', '));
        }
      } catch (e) {
        console.warn('[createInitialProfile] Table health check exception:', e);
      }

      // Make sure we're using an array for the insert operation
      const { error } = await supabase
        .from('profiles')
        .insert([initialProfileData]);

      if (error) {
        logError(error, { 
          context: 'createInitialProfile:insert', 
          user: userId,
          data: { code: error.code }
        });
        
        // Provide more specific error messages
        if (error.code === '23505') { // Unique violation
          console.warn('[createInitialProfile] Profile already exists for user:', userId);
          toast.error('Profile already exists');
          // For unique violation, we consider this a "success" since the profile exists
          return true;
        } else if (error.code === '23503') { // Foreign key violation
          toast.error('Authentication error: User does not exist in auth system');
        } else if (error.message.includes('role')) {
          console.error('[createInitialProfile] Role field error. Schema mismatch detected.');
          toast.error('Database schema issue: Check role field');
          
          // Try a fallback with just basic fields
          const { error: fallbackError } = await supabase
            .from('profiles')
            .insert([{ 
              id: userId,
              full_name: initialProfileData.full_name 
            }]);
            
          if (!fallbackError) {
            console.log('[createInitialProfile] Fallback profile created successfully');
            return true;
          } else {
            console.error('[createInitialProfile] Fallback insert also failed:', fallbackError);
          }
        } else if (error.message.includes('status')) {
          console.error('[createInitialProfile] Status field error. Schema mismatch detected.');
          toast.error('Database schema issue: Check status field');
        } else {
          toast.error(`Failed to create profile: ${error.message}`);
        }
        return false;
      }
      
      console.log('[createInitialProfile] Profile inserted successfully for user:', userId);
      return true;
    } catch (error: any) {
      logError(error, { 
        context: 'createInitialProfile:exception', 
        user: userId, 
        sendToAnalytics: true 
      });
      toast.error(`Unexpected error during profile creation: ${error.message || 'Unknown error'}`);
      return false;
    }
  }, []);

  // Function to fetch user profile from 'profiles' table
  const fetchUserProfile = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    let fetchedProfile: Profile | null = null;
    let profileExists = false;

    try {
      // Attempt to fetch existing profile with all fields including role and status
      const { data, error } = await supabase
        .from('profiles')
        .select('*') // Select all fields including role and status
        .eq('id', userId)
        .single();

      if (data) {
        fetchedProfile = data as Profile;
        profileExists = true;
        console.log('[fetchUserProfile] Profile found:', fetchedProfile);
      } else if (error && error.code === 'PGRST116') { // Profile not found
        console.log('[fetchUserProfile] Profile not found. Attempting creation...');
        const creationSuccess = await createInitialProfile(userId);

        if (creationSuccess) {
          // Fetch the newly created profile
          const { data: newData, error: newError } = await supabase
            .from('profiles')
            .select('*') // Select all fields
            .eq('id', userId)
            .single();

          if (newData) {
            fetchedProfile = newData as Profile;
            profileExists = true;
            console.log('[fetchUserProfile] Newly created profile fetched:', fetchedProfile);
          } else if (newError) {
            logError(newError, { 
              context: 'fetchUserProfile:fetchNewProfile', 
              user: userId 
            });
            toast.error('Error retrieving your profile');
          }
        } else {
          console.error('[fetchUserProfile] Profile creation failed.');
          toast.error('Could not create your profile. Please try again later.');
        }
      } else if (error) {
        logError(error, { 
          context: 'fetchUserProfile:fetchExisting', 
          user: userId 
        });
        toast.error('Error loading profile');
      }
    } catch (error: any) {
      logError(error, { 
        context: 'fetchUserProfile:exception', 
        user: userId, 
        sendToAnalytics: true 
      });
      toast.error(`Profile loading error: ${error.message || 'Unknown error'}`);
    } finally {
      setProfile(fetchedProfile);
      setIsLoading(false);
    }
  }, [createInitialProfile]);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    // Listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!isMounted) return;

        console.log("[onAuthStateChange] Auth state changed. Session:", currentSession);
        const currentUser = currentSession?.user || null;
        setSession(currentSession);
        setUser(currentUser);
        // Fetch profile immediately when auth state changes
        await fetchUserProfile(currentUser?.id);
      }
    );

    // Initial check for session on mount
    const getCurrentSessionAndProfile = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        console.log("[Initial Load] Current session:", currentSession);
        const currentUser = currentSession?.user || null;
        setSession(currentSession);
        setUser(currentUser);
        // Fetch profile after getting the initial session
        await fetchUserProfile(currentUser?.id);

      } catch (error: any) {
        if (!isMounted) return;
        logError(error, { 
          context: 'useAuthState:getSession', 
          sendToAnalytics: true 
        });
        toast.error('Failed to initialize authentication');
        setProfile(null); // Ensure profile is null on error
        setIsLoading(false); // Set loading false on error
      }
    };

    getCurrentSessionAndProfile();

    // Cleanup function
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      console.log("[Cleanup] Unsubscribed from onAuthStateChange.");
    };
  }, [fetchUserProfile]); // Add fetchUserProfile as dependency

  // Expose setProfile for manual updates if needed elsewhere (e.g., after profile edit form)
  const updateProfileState = useCallback((newProfile: Profile | null) => {
    setProfile(newProfile);
  }, []);

  return { user, session, profile, isLoading, setProfile: updateProfileState };
};
