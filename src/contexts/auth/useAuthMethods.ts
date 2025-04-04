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
      // Enhanced error handling with more specific messages
      let errorMessage = 'An error occurred while signing in';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email before signing in';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
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
            username: userData.username,
            full_name: userData.full_name,
          },
          // Set email confirmation based on environment
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // Create the user profile if we have a user
      if (data.user) {
        await createUserProfile(data.user.id, userData);
      }

      if (data?.user?.identities?.length === 0) {
        toast.error('The email address is already registered. Please sign in instead.');
      } else {
        toast.success('Account created successfully. Please check your email for verification.');
      }
      
      return data;
    } catch (error: any) {
      // Enhanced error handling with more specific messages
      let errorMessage = 'An error occurred while creating your account';
      
      if (error.message) {
        if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered';
        } else if (error.message.includes('password')) {
          errorMessage = error.message; // Keep password-specific errors
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
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
      
      // Prevent users from changing their role or status through this method
      const { role, status, ...safeProfileData } = profileData;
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update(safeProfileData)
        .eq('id', safeProfileData.id);

      if (error) {
        throw error;
      }

      // Fetch the updated profile
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', safeProfileData.id)
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
        avatar_url: userData.avatar_url || null,
        role: 'user' as const, // Default role is 'user'
        status: 'active' as const, // Default status is 'active'
      };

      const { error } = await supabase
        .from('profiles')
        .insert(profileData);

      if (error) {
        console.error('Supabase insert error:', error);
        
        // Provide more specific error messages
        if (error.code === '23505') { // Unique violation
          console.warn('Profile already exists for this user, skipping creation');
          return; // Not throwing, as this might be a retry scenario
        } else if (error.code === '23503') { // Foreign key violation
          throw new Error('Authentication error: User does not exist in auth system');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
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
