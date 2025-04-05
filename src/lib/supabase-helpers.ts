import { supabase } from '@/integrations/supabase/client';
import { PointOfInterest } from '@/types/database';
import { UserProfile } from './types';

export const fetchFeaturedPOIs = async (): Promise<{ data: PointOfInterest[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('points_of_interest')
      .select('*')
      .eq('featured', true)
      .limit(5);
    
    return { data, error };
  } catch (err) {
    console.error('Error in fetchFeaturedPOIs:', err);
    return { data: null, error: err };
  }
};

export const fetchUserProfile = async (userId: string): Promise<{ data: UserProfile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  } catch (err) {
    console.error('Error in fetchUserProfile:', err);
    return { data: null, error: err };
  }
};
