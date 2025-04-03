
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PointOfInterest } from '@/types/database';

// Function to fetch a single POI by ID
const fetchPOI = async (id: string): Promise<PointOfInterest | null> => {
  try {
    // Cast the query to any to bypass TypeScript complaint about points_of_interest
    const { data, error } = await (supabase
      .from('points_of_interest') as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching POI:', error);
      throw error;
    }

    return data as PointOfInterest;
  } catch (err) {
    console.error('Error in fetchPOI:', err);
    return null;
  }
};

// Function to fetch POIs by category
const fetchPOIsByCategory = async (category: string): Promise<PointOfInterest[]> => {
  try {
    // Cast the query to any to bypass TypeScript complaint about points_of_interest
    const { data, error } = await (supabase
      .from('points_of_interest') as any)
      .select('*')
      .eq('category', category);

    if (error) {
      console.error('Error fetching POIs by category:', error);
      throw error;
    }

    return data as PointOfInterest[];
  } catch (err) {
    console.error('Error in fetchPOIsByCategory:', err);
    return [];
  }
};

// Hook to fetch a POI by ID
export const usePOI = (id: string) => {
  return useQuery({
    queryKey: ['poi', id],
    queryFn: () => fetchPOI(id),
    enabled: !!id,
  });
};

// Hook to fetch POIs by category
export const usePOIsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['pois', category],
    queryFn: () => fetchPOIsByCategory(category),
    enabled: !!category,
  });
};

export default usePOI;
