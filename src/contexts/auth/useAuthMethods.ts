
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database'; 
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
  const signUp = async (email: string, password: string, userData: { 
    full_name: string; 
    username?: string; 
    is_tourist?: boolean; 
    stay_duration?: number; 
    interests?: string[]; 
    dietary_preferences?: string[];
    bio?: string;
    avatar_url?: string;
  }) => {
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
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profileData.id);

      if (error) {
        throw error;
      }

      // Fetch the updated profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileData.id)
        .single();

      // Update the profile state with the updated profile
      if (updatedProfile) {
        setProfile(updatedProfile as Profile);
      }
      
      toast.success('Profile updated successfully');
      return updatedProfile;
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
    stay_duration?: number;
    interests?: string[]; 
    dietary_preferences?: string[];
    bio?: string;
    avatar_url?: string;
  }) => {
    try {
      // Prepare profile data with proper types
      const profileData = {
        id: userId,
        username: userData.username || null,
        full_name: userData.full_name || null,
        stay_duration: userData.stay_duration || null,
        interests: userData.interests || null,
        dietary_preferences: userData.dietary_preferences || null,
        is_tourist: userData.is_tourist !== undefined ? userData.is_tourist : true,
        bio: userData.bio || null,
        avatar_url: userData.avatar_url || null
      };

      const { error } = await supabase
        .from('profiles')
        .insert(profileData);

      if (error) {
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
