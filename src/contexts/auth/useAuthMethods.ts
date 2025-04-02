
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/database';

export const useAuthMethods = (
  user: User | null,
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
) => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Logged in',
        description: 'Welcome back to Discover Diani!',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Welcome to Discover Diani!',
        description: 'Your account has been created successfully.',
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;

    try {
      // We use any here to avoid TypeScript errors with the Supabase client
      const { error } = await supabase
        .from('profiles')
        .update(data as any)
        .eq('id', user.id) as { error: any };

      if (error) {
        toast({
          title: 'Update failed',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    updateProfile
  };
};
