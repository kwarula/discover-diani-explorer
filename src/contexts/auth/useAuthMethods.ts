
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { toast } from 'sonner';

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

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsSigningUp(true);
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            // Include other user metadata as needed
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
      // Use type assertion to work with Supabase typing
      const { error } = await supabase
        .from('profiles')
        .update(profileData as any)
        .eq('id', profileData.id as string) as any;

      if (error) {
        throw error;
      }

      // Update the profile state
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating your profile');
      throw error;
    }
  };

  // Helper function to create a user profile
  const createUserProfile = async (userId: string, userData: any) => {
    try {
      const profileData = {
        id: userId,
        full_name: userData.full_name,
        username: null,
        avatar_url: null,
        is_tourist: userData.is_tourist || false,
        stay_duration: userData.is_tourist ? (userData.stay_duration || null) : null,
        dietary_preferences: userData.dietary_preferences || null,
        interests: userData.interests || null,
      };

      // Use type assertion to work with Supabase typing
      const { error } = await supabase
        .from('profiles')
        .insert([profileData as any]) as any;

      if (error) {
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
    isSigningIn,
    isSigningUp,
    isSigningOut 
  };
};
