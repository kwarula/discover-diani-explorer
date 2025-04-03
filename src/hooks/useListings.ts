
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database'; // Import Tables type

// Define the columns to select for listings
const listingColumns = `
  id, category, created_at, description, featured, guide_recommended,
  images, is_verified, location, price, price_range, price_unit, status,
  sub_category, tide_dependency, title, transport_instructions, updated_at,
  user_id, wildlife_notice
`;

// Function to fetch listings with optional pagination and category filtering
export const useListings = (category: string | null = null, limit: number = 10, page: number = 1) => {
  const fetchListings = async () => {
    try {
      let query = supabase
        .from('listings' as any) // Re-adding workaround
        .select(listingColumns); // Use explicit columns

      if (category) {
        query = query.eq('category', category);
      }
      
      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)
        .eq('status', 'approved');
      
      if (error) {
        throw error;
      }

      // Re-adding assertion as type inference is unreliable here
      return data as Tables<'listings'>[]; // Assert type
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
      // Select listing columns and potentially nested reviews
      // Note: Selecting nested reviews ('reviews(*)') might still cause type issues if not handled carefully.
      // Consider fetching reviews separately using useReviews hook in the component if problems arise.
      const { data, error } = await supabase
        .from('listings' as any) // Re-adding workaround
        .select(`${listingColumns}, reviews(*)`) // Select listing columns and all review columns
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      // Re-adding assertion
      return data as Tables<'listings'> & { reviews: Tables<'reviews'>[] }; // Assert type with reviews
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
