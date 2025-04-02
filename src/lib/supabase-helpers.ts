
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Helper function for Supabase operations that handles errors consistently
 */
export async function safeQueryFunction<T>(
  operation: () => Promise<{ data: T | null; error: any | null }>
): Promise<T | null> {
  try {
    const { data, error } = await operation();
    
    if (error) {
      console.error('Supabase operation error:', error);
      toast.error(error.message || 'An error occurred during the operation');
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error('Unexpected error in Supabase operation:', error);
    toast.error(error.message || 'An unexpected error occurred');
    return null;
  }
}

/**
 * Function to check if a user has an operator profile
 */
export async function checkUserHasOperator(userId: string): Promise<boolean> {
  const data = await safeQueryFunction(() => 
    supabase
      .from('operators')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle() as any
  );
  
  return !!data;
}

/**
 * Function to get a user's profile
 */
export async function getUserProfile(userId: string) {
  return await safeQueryFunction(() => 
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single() as any
  );
}

/**
 * Function to update a user's profile
 */
export async function updateUserProfile(userId: string, profileData: any) {
  return await safeQueryFunction(() => 
    supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId) as any
  );
}
