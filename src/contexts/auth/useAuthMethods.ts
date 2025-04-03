
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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

export const useAuthMethods = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      toast.success('Signed in successfully!');
      return { success: true, data };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<RegisterFormValues>): Promise<AuthResult> => {
    setIsLoading(true);
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
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
      }
      
      toast.success('Signed out successfully!');
      navigate('/');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign out');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
    return await signIn(data.email, data.password);
  };

  const handleRegister: SubmitHandler<RegisterFormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return { success: false, error: 'Passwords do not match' };
    }
    
    return await signUp(data.email, data.password, {
      fullName: data.fullName,
      stayDuration: data.stayDuration,
      interests: data.interests,
      dietaryPreferences: data.dietaryPreferences,
    });
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
    handleLogin,
    handleRegister,
    updateProfile,
    isLoading,
  };
};
