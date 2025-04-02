
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Function to fetch listings with optional pagination and category filtering
export const useListings = (category: string | null = null, limit: number = 10, page: number = 1) => {
  const fetchListings = async () => {
    try {
      let query = supabase
        .from('listings')
        .select('*') as any;
      
      if (category) {
        query = query.eq('category', category);
      }
      
      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)
        .eq('status', 'approved');
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['listings', category, limit, page],
    queryFn: fetchListings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Function to fetch a single listing by ID
export const useListing = (id: string | undefined) => {
  const fetchListing = async () => {
    if (!id) return null;
    
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, reviews(*)')
        .eq('id', id)
        .single() as any;
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['listing', id],
    queryFn: fetchListing,
    enabled: !!id, // Only run the query if we have an ID
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
