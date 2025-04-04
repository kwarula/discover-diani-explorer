import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/database'; // Import Listing type directly
import { logError } from '@/utils/errorLogger';

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
    // Create a timeout mechanism
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 second timeout

    try {
      let query = supabase
        .from('listings')
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
      
      clearTimeout(timeoutId);
      
      if (controller.signal.aborted) {
        throw new Error("Request timed out");
      }
      
      if (error) {
        throw error;
      }

      // Re-adding assertion as type inference is unreliable here
      return data as Listing[]; // Assert type
    } catch (error: any) {
      clearTimeout(timeoutId);
      logError(error, { 
        context: 'useListings:fetchListings', 
        data: { category, limit, page } 
      });
      
      // Provide fallback data in development
      if (import.meta.env.DEV) {
        console.warn('Using fallback listings data in development mode');
        return [
          {
            id: 'fallback-1',
            title: 'Diani Beach Tour',
            category: 'activity',
            description: 'Explore the beautiful Diani Beach',
            price_range: 'medium',
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Listing,
          {
            id: 'fallback-2',
            title: 'Seafood Restaurant',
            category: 'service',
            description: 'Fresh seafood daily',
            price_range: 'medium',
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Listing
        ].slice(0, limit);
      }
      
      throw error;
    }
  };

  return useQuery({
    queryKey: ['listings', category, limit, page],
    queryFn: fetchListings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
};

// Function to fetch a single listing by ID
export const useListing = (id: string | undefined) => {
  const fetchListing = async () => {
    if (!id) return null;
    
    // Create a timeout mechanism
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 second timeout
    
    try {
      // Select listing columns and potentially nested reviews
      const { data, error } = await supabase
        .from('listings')
        .select(`${listingColumns}, reviews(*)`) // Select listing columns and all review columns
        .eq('id', id)
        .single();

      clearTimeout(timeoutId);
      
      if (controller.signal.aborted) {
        throw new Error("Request timed out");
      }
      
      if (error) {
        throw error;
      }

      // Assert type with reviews
      return data as Listing & { reviews: any[] }; 
    } catch (error: any) {
      clearTimeout(timeoutId);
      logError(error, { 
        context: 'useListings:fetchListing', 
        data: { id } 
      });
      
      // Provide fallback data in development
      if (import.meta.env.DEV && id === 'fallback-1') {
        console.warn('Using fallback listing data in development mode');
        return {
          id: 'fallback-1',
          title: 'Diani Beach Tour',
          category: 'activity',
          description: 'Explore the beautiful Diani Beach with our experienced guide.',
          price_range: 'medium',
          featured: true,
          reviews: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Listing & { reviews: any[] };
      }
      
      throw error;
    }
  };

  return useQuery({
    queryKey: ['listing', id],
    queryFn: fetchListing,
    enabled: !!id, // Only run the query if we have an ID
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
