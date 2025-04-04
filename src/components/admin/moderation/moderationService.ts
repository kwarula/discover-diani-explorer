
import { supabase } from '@/integrations/supabase/client';
import { FlaggedContent } from './types';

/**
 * Fetch all flagged content from Supabase
 */
export const fetchFlaggedContent = async (): Promise<FlaggedContent[]> => {
  const { data, error } = await supabase
    .from('flagged_content')
    .select('*')
    .order('reported_at', { ascending: false });

  if (error) {
    console.error("Supabase fetch error (flagged_content):", error);
    throw new Error(error.message || 'Failed to fetch flagged content');
  }
  
  // Make sure to include the reported_by_email field in the results
  return data as FlaggedContent[];
};

/**
 * Update the status of a flagged item
 */
export const updateFlagStatus = async (id: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('flagged_content')
    .update({ status })
    .eq('id', id);
    
  if (error) throw new Error(error.message);
};

/**
 * Remove content based on its type and ID
 */
export const removeContent = async (
  flagId: string, 
  contentId: string, 
  contentType: string
): Promise<void> => {
  console.warn(`Removing content type '${contentType}' (ID: ${contentId})`);
  
  // For now, this is just updating the flag status
  // In a real implementation, you would also delete the actual content
  const { error } = await supabase
    .from('flagged_content')
    .update({ status: 'Resolved' })
    .eq('id', flagId);
    
  if (error) {
    throw new Error(`Failed to update flag status after content removal: ${error.message}`);
  }
};
