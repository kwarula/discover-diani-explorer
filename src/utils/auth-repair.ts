import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Performs a health check of the user's authentication state
 * Returns true if everything is OK, false if repairs were needed
 */
export const checkAuthHealth = async (): Promise<boolean> => {
  try {
    // Check if we have a session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Auth health check - Session error:', sessionError);
      return false;
    }
    
    // No session means not logged in, which is a valid state
    if (!sessionData?.session) {
      return true;
    }
    
    // Check if user has a profile
    const userId = sessionData.session.user.id;
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    // If profile exists, everything is good
    if (profileData) {
      return true;
    }
    
    // If error is not "not found", there's another issue
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Auth health check - Profile error:', profileError);
      return false;
    }
    
    // Missing profile, needs repair
    return false;
  } catch (error) {
    console.error('Auth health check exception:', error);
    return false;
  }
};

/**
 * Attempts to repair common authentication issues
 * Returns true if repairs were successful, false otherwise
 */
export const repairAuthIssues = async (): Promise<boolean> => {
  try {
    // Get current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      toast.error('Authentication error: Unable to get session');
      return false;
    }
    
    // Not logged in, nothing to repair
    if (!sessionData?.session) {
      return true;
    }
    
    const userId = sessionData.session.user.id;
    
    // Check if profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    // If profile exists, no repair needed
    if (profileData) {
      return true;
    }
    
    // Create missing profile
    const { error: createError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        full_name: sessionData.session.user.user_metadata?.full_name || 
                 sessionData.session.user.user_metadata?.name || 'User',
        role: 'user',
        status: 'active'
      }]);
      
    if (createError) {
      console.error('Profile creation error during repair:', createError);
      
      // If RLS error, try simplified approach
      if (createError.message?.includes('row-level security policy')) {
        const { error: simpleError } = await supabase
          .from('profiles')
          .insert([{ id: userId }]);
          
        if (simpleError) {
          toast.error('Unable to create profile: Permission error');
          return false;
        }
      } else {
        toast.error(`Profile creation failed: ${createError.message}`);
        return false;
      }
    }
    
    toast.success('Account repaired successfully');
    return true;
  } catch (error: any) {
    toast.error(`Repair failed: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Force refreshes the session token
 * Useful when facing token expiration issues
 */
export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      toast.error(`Session refresh failed: ${error.message}`);
      return false;
    }
    
    if (data.session) {
      toast.success('Session refreshed successfully');
      return true;
    } else {
      toast.info('No active session to refresh');
      return false;
    }
  } catch (error: any) {
    toast.error(`Session refresh error: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Completely resets the auth state by clearing localStorage and session storage
 * Use this to fix auth loading issues when users are stuck in loading state
 */
export const resetAuthState = async (): Promise<boolean> => {
  try {
    // 1. First try to sign out properly if there's a session
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error during sign out, continuing with manual reset:', e);
    }
    
    // 2. Clear any Supabase-related items from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('supabase') || key?.includes('sb-') || key?.includes('discover-diani-auth-token')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove collected keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // 3. Also clear sessionStorage
    sessionStorage.clear();
    
    // 4. Let user know it was successful
    toast.success('Authentication state reset successfully. Please try logging in again.');
    
    // 5. Force page reload after a short delay to reinitialize everything
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
    
    return true;
  } catch (error: any) {
    toast.error(`Reset failed: ${error.message || 'Unknown error'}`);
    return false;
  }
}; 