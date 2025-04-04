
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Database } from '@/types/database'; // Import Database type
import { toast } from 'sonner';
import { Provider } from '@supabase/supabase-js';

export const useAuthMethods = (setProfile: React.Dispatch<React.SetStateAction<Profile | null>>) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      setIsSigningIn(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast.success('Successfully signed in');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while signing in');
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  // Update signUp to accept username in userData
  const signUp = async (email: string, password: string, userData: { full_name: string; username?: string; is_tourist?: boolean; stay_duration?: number; interests?: string[] }) => {
    try {
      setIsSigningUp(true);
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Store username and full_name in auth.users metadata if desired
            // This can be useful for quick access without joining profiles table initially
            username: userData.username,
            full_name: userData.full_name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Create the user profile if we have a user
      if (data.user) {
        await createUserProfile(data.user.id, userData);
      }

      toast.success('Account created successfully. You are now signed in.');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating your account');
      throw error;
    } finally {
      setIsSigningUp(false);
    }
  };

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear profile state when user signs out
      setProfile(null);
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while signing out');
      throw error;
    } finally {
      setIsSigningOut(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      if (!profileData.id) {
        throw new Error('Profile ID is required for updates');
      }
      
      // Use explicit type cast to bypass TypeScript errors with Supabase client
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profileData.id) as any;

      if (error) {
        throw error;
      }

      // Update the profile state
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      toast.success('Profile updated successfully');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating your profile');
      throw error;
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      // No need for loading state here as Supabase handles the redirect flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // Redirect back to the dashboard after successful OAuth flow
          redirectTo: `${window.location.origin}/dashboard`, 
        },
      });

      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      toast.error(error.message || `An error occurred while signing in with ${provider}`);
      throw error;
    }
  };

  // Helper function to create a user profile
  const createUserProfile = async (userId: string, userData: { 
    full_name: string; 
    username?: string; 
    is_tourist?: boolean; 
    stay_duration?: number; // Note: stay_duration from form is string, needs conversion before calling signUp
    interests?: string[]; 
    dietary_preferences?: string[]; // Add dietary preferences
  }) => {
    try {
      // Ensure profileData matches the Database['public']['Tables']['profiles']['Insert'] type
      const profileData: Database['public']['Tables']['profiles']['Insert'] = {
        id: userId,
        username: userData.username || null, // Ensure username can be null if needed, though likely required
        full_name: userData.full_name || null,
        // stay_duration needs to be a number or null. Ensure conversion happens before this point.
        stay_duration: userData.is_tourist ? (userData.stay_duration ?? null) : null, 
        interests: userData.interests ?? null,
        dietary_preferences: userData.dietary_preferences ?? null, // Add dietary preferences
        // avatar_url is not collected in registration form, defaults to null
      };

      // Remove 'as any' casts for better type checking
      const { error } = await supabase
        .from('profiles')
        .insert(profileData); // Pass the correctly typed object

      if (error) {
        // Log the specific Supabase error
        console.error('Supabase insert error:', error); 
        throw error; 
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  return { 
    signIn, 
    signUp, 
    signOut, 
    updateProfile, 
    signInWithProvider,
    isSigningIn,
    isSigningUp,
    isSigningOut
  };
};
