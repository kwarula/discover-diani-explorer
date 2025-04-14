import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database, Tables } from '@/types/database'; // Import Tables type
import { logError } from '@/utils/errorLogger';

// Define the columns to select for listings
const listingColumns = `
  id, category, created_at, description, featured, guide_recommended,
  images, is_verified, location, price, price_range, price_unit, status,
  sub_category, tide_dependency, title, transport_instructions, updated_at,
  user_id, wildlife_notice
`;

// Function to fetch listings with optional filtering and pagination
export const useListings = (
  {
    category,
    searchQuery,
    location,
    limit = 10,
    page = 1,
  }: {
    category?: string | null;
    searchQuery?: string | null;
    location?: string | null;
    limit?: number;
    page?: number;
  } = {} // Default empty object
) => {
  const fetchListings = async () => {
    // Create a timeout mechanism
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 20000); // Increased to 20 second timeout

    try {
      let query = supabase
        .from('listings')
        .select(listingColumns); // Use explicit columns

      // Apply filters
      if (category && category !== 'all') { // Ignore 'all' category filter
        query = query.eq('category', category);
      }
      if (searchQuery) {
        // Simple search on title and description. Consider FTS for better performance/relevance later.
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      if (location) {
        // Simple search on location string.
        query = query.ilike('location', `%${location}%`);
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

      // Assert the correct type
      return data as Tables<'listings'>[];
    } catch (error: any) {
      clearTimeout(timeoutId);
      logError(error, { 
        context: 'useListings:fetchListings',
        data: { category, searchQuery, location, limit, page } // Updated data for logging
      });

      // Removed fallback data logic
      throw error; // Re-throw the error to be handled by react-query
    }
  };

  return useQuery({
    // Update queryKey to include new filters
    queryKey: ['listings', category, searchQuery, location, limit, page],
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
    }, 20000); // Increased to 20 second timeout

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

      // Assert type with reviews using Tables<'reviews'>
      return data as Tables<'listings'> & { reviews: Tables<'reviews'>[] };
    } catch (error: any) {
      clearTimeout(timeoutId);
      logError(error, { 
        context: 'useListings:fetchListing', 
        data: { id }
      });

      // Removed fallback data logic
      throw error; // Re-throw the error to be handled by react-query
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
