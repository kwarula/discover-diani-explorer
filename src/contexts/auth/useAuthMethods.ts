
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, Provider } from '@supabase/supabase-js';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Profile } from '@/types/database';

// Define the result types for authentication operations
export type AuthResult = {
  success: boolean;
  error?: string;
  data?: {
    user: User | null;
    session: Session | null;
  };
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  stayDuration?: number;
  interests?: string[];
  dietaryPreferences?: string[];
  isTourist?: boolean; // Added for onboarding flow
};

export type ProfileFormValues = {
  fullName?: string;
  username?: string;
  stayDuration?: number;
  interests?: string[];
  dietaryPreferences?: string[];
};

// Modified to receive a navigation function instead of using useNavigate directly
export const useAuthMethods = (setProfile?: (profile: Profile | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    setIsSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      // Fetch the user profile if sign-in is successful
      if (data.user && setProfile) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);
        }
      }

      toast.success('Signed in successfully!');
      return { success: true, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
      setIsSigningIn(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<RegisterFormValues>): Promise<AuthResult> => {
    setIsLoading(true);
    setIsSigningUp(true);
    try {
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      // If user is created, also create a profile
      if (data?.user) {
        // Extract profile data from userData
        const profileData: Partial<Profile> = {
          id: data.user.id,
          full_name: userData.fullName,
          stay_duration: userData.stayDuration,
          interests: userData.interests,
          dietary_preferences: userData.dietaryPreferences,
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // We don't want to fail the sign-up if just the profile fails
          toast.error(`Account created but profile setup failed: ${profileError.message}`);
        }
      }

      toast.success('Signed up successfully! Please check your email for confirmation.');
      return { success: true, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
      setIsSigningUp(false);
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    setIsLoading(true);
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Signed out successfully!');
      
      // Instead of using navigate directly, let Auth context handle navigation
      if (setProfile) {
        setProfile(null);
      }
      
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign out');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
      setIsSigningOut(false);
    }
  };

  const signInWithProvider = async (provider: Provider): Promise<AuthResult> => {
    setIsLoading(true);
    setIsSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      // With OAuth, we'll handle the profile fetch on redirect callback
      return { success: true, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
      setIsSigningIn(false);
    }
  };

  const updateProfile = async (userId: string, data: ProfileFormValues): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Transform data to match the profiles table structure
      const profileData = {
        full_name: data.fullName,
        username: data.username,
        stay_duration: data.stayDuration,
        interests: data.interests,
        dietary_preferences: data.dietaryPreferences,
      };

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);

      if (error) {
        toast.error(`Failed to update profile: ${error.message}`);
        return false;
      }

      // Update the local state if setProfile is provided
      if (setProfile) {
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (updatedProfile) {
          setProfile(updatedProfile as Profile);
        }
      }

      toast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    updateProfile,
    isLoading,
    isSigningIn,
    isSigningUp,
    isSigningOut,
  };
};
