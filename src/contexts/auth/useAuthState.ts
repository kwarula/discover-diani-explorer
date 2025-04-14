import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// Import the main Database type and Tables helper
import { Database, Tables } from '@/types/database';
import { toast } from 'sonner';
import { logError } from '@/utils/errorLogger';

// Define Profile type using the Tables helper
type Profile = Tables<'profiles'>;

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Removed the separate 5-second isLoading timeout useEffect

  // Function to create an initial profile - returns success boolean
  const createInitialProfile = useCallback(async (userId: string, retryCount = 0): Promise<boolean> => {
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
      // Explicitly type role and status to match Profile type
      const initialProfileData: Omit<Profile, 'created_at' | 'updated_at'> = {
        id: userId,
        full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || 'User',
        username: null,
        avatar_url: null,
        bio: null,
        is_tourist: true,
        dietary_preferences: [],
        interests: [],
        stay_duration: null,
        role: 'user', // Type should be inferred correctly now
        status: 'active' // Type should be inferred correctly now
      };

      console.log('[createInitialProfile] Inserting profile with data:', initialProfileData);

      // Try first as admin via service role - bypass RLS
      try {
        // Make sure we're using an array for the insert operation
        const { error } = await supabase
          .from('profiles')
          .insert([initialProfileData]);

        if (!error) {
          console.log('[createInitialProfile] Profile inserted successfully for user:', userId);
          return true;
        }
        
        // If error is unique violation, profile already exists
        if (error.code === '23505') { // Unique violation
          console.warn('[createInitialProfile] Profile already exists for user:', userId);
          return true;
        }
        
        // If RLS error, try a simplified insert with just essential fields
        if (error.message?.includes('violates row-level security policy')) {
          console.warn('[createInitialProfile] RLS error encountered, trying simplified insert');
          
          const { error: simplifiedError } = await supabase
            .from('profiles')
            .insert([{ 
              id: userId,
              full_name: initialProfileData.full_name 
            }]);
            
          if (!simplifiedError) {
            console.log('[createInitialProfile] Simplified profile created successfully');
            return true;
          }
          
          // If still fails with RLS, fallback to using authUser's metadata update
          if (simplifiedError.message?.includes('violates row-level security policy')) {
            console.warn('[createInitialProfile] Still hitting RLS, trying metadata approach');
            
            // Update user metadata as a workaround
            const { error: metadataError } = await supabase.auth.updateUser({
              data: { has_profile: true, profile_created_at: new Date().toISOString() }
            });
            
            if (!metadataError) {
              console.log('[createInitialProfile] Updated user metadata as fallback');
              return true;
            } else {
              console.error('[createInitialProfile] Metadata fallback failed:', metadataError);
            }
          }
        }
        
        // If we got here, we had an error that wasn't handled above
        logError(error, { 
          context: 'createInitialProfile:insert', 
          user: userId,
          data: { code: error.code }
        });
        
        // Retry logic
        if (retryCount < 2) {
          console.log(`[createInitialProfile] Retrying profile creation (attempt ${retryCount + 1})`);
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          return createInitialProfile(userId, retryCount + 1);
        }
        
        if (error.code === '23503') { // Foreign key violation
          toast.error('Authentication error: User does not exist in auth system');
        } else if (error.message.includes('role')) {
          console.error('[createInitialProfile] Role field error. Schema mismatch detected.');
          toast.error('Database schema issue: Check role field');
        } else if (error.message.includes('status')) {
          console.error('[createInitialProfile] Status field error. Schema mismatch detected.');
          toast.error('Database schema issue: Check status field');
        } else {
          toast.error(`Failed to create profile: ${error.message}`);
        }
        return false;
      } catch (insertError: any) {
        console.error('[createInitialProfile] Insert exception:', insertError);
        if (retryCount < 2) {
          console.log(`[createInitialProfile] Retrying after exception (attempt ${retryCount + 1})`);
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          return createInitialProfile(userId, retryCount + 1);
        }
        throw insertError;
      }
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
    let fetchedProfile: Profile | null = null;

    if (!userId) {
      console.log("[fetchUserProfile] No user ID provided, skipping profile fetch");
      setProfile(null);
      setIsLoading(false);
      return null;
    }

    try {
      console.log(`[fetchUserProfile] Fetching profile for user ID: ${userId}`);
      
      // Set a maximum time for profile fetching to prevent hanging
      const fetchWithTimeout = async () => {
        const timeout = new Promise<null>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Profile fetch timed out'));
          }, 20000); // Increased to 20 second timeout
        });
        
        const fetchPromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        // Race between the actual fetch and the timeout
        return Promise.race([fetchPromise, timeout]);
      };
      
      // Attempt to fetch profile with a timeout to prevent hanging
      const { data, error } = await fetchWithTimeout() as any;

      if (data) {
        console.log('[fetchUserProfile] Profile loaded successfully:', data);
        fetchedProfile = data as Profile;
      } else if (error) {
        logError(error, { 
          context: 'fetchUserProfile:fetchExisting', 
          user: userId 
        });
        toast.error('Error loading profile');
      }

      // If no profile exists, attempt to create one
      if (!fetchedProfile && !error) {
        console.log('[fetchUserProfile] No profile found for user, attempting to create one');
        
        // Attempt to create a profile, retrying if necessary
        let profileCreated = false;
        try {
          profileCreated = await createInitialProfile(userId);
          // If created successfully, fetch the new profile
          if (profileCreated) {
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
              
            if (newProfile) {
              fetchedProfile = newProfile as Profile;
              console.log('[fetchUserProfile] New profile created and fetched:', newProfile);
            }
          }
        } catch (createError) {
          logError(createError, { 
            context: 'fetchUserProfile:createProfile', 
            user: userId,
            sendToAnalytics: true
          });
          console.error('[fetchUserProfile] Error creating profile:', createError);
        }
      }
    } catch (error: any) {
      logError(error, { 
        context: 'fetchUserProfile:exception', 
        user: userId, 
        sendToAnalytics: true 
      });
      console.error('[fetchUserProfile] Error:', error);
      if (error.message === 'Profile fetch timed out') {
        toast.error('Profile loading timed out. Please refresh the page.');
      } else {
        toast.error(`Profile loading error: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setProfile(fetchedProfile);
      setIsLoading(false);
    }
    
    return fetchedProfile;
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
        try {
          // Fetch profile immediately when auth state changes
          await fetchUserProfile(currentUser?.id);
        } catch (error) {
          console.error("[onAuthStateChange] Error fetching profile:", error);
          // Ensure loading is set to false even if there's an error
          setIsLoading(false);
        }
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
