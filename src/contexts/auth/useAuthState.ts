
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

export type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOperator: boolean;
};

export const useAuthState = (): AuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isOperator, setIsOperator] = useState<boolean>(false);

  const resetState = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setIsOperator(false);
  };

  useEffect(() => {
    // Initialize with current session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          await loadUserProfile(currentSession.user.id);
          await checkUserRoles(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        resetState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          setUser(newSession.user);
          await loadUserProfile(newSession.user.id);
          await checkUserRoles(newSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          resetState();
        }
        
        // Always update loading state
        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Fetch user profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Unexpected error loading profile:', error);
    }
  };

  const checkUserRoles = async (userId: string) => {
    try {
      // Check if user is an operator
      const { data: operatorData, error: operatorError } = await supabase
        .from('operators')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!operatorError && operatorData) {
        setIsOperator(true);
      }

      // For now, hardcode admin check - this should be moved to a proper roles table or claims
      // const isAdminEmail = user?.email === 'admin@example.com';
      // setIsAdmin(isAdminEmail);
      
      // TODO: Implement proper role-based check for admin status
      
    } catch (error) {
      console.error('Error checking user roles:', error);
    }
  };

  return {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    isOperator,
  };
};
