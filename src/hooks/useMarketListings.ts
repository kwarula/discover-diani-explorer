import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database';

// Define the structure of a listing object, potentially joining operator and calculated rating
export type MarketListing = Tables<'listings'> & {
  // We might add operator details or calculated rating later
  average_rating?: number;
  operator_name?: string;
  operator_logo_url?: string | null;
};

// Define the hook's input parameters
interface UseMarketListingsProps {
  category?: string | null; // e.g., 'property', 'products', 'services', 'transport'
  searchQuery?: string | null;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | null; // Add 'rating' later
  limit?: number;
}

// Define the hook's return value structure
interface UseMarketListingsReturn {
  listings: MarketListing[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useMarketListings = ({
  category,
  searchQuery,
  sortBy,
  limit = 12, // Default limit
}: UseMarketListingsProps): UseMarketListingsReturn => {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          reviews ( rating ) 
        `) // Select all listing fields and related review ratings
        .eq('status', 'active'); // Assuming only active listings should be shown

      // Apply category filter
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply search query filter (searching title and description)
      if (searchQuery) {
        // Using 'ilike' for case-insensitive search. Consider 'fts' for full-text search later.
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      // Apply sorting
      // Note: Sorting by calculated average rating requires more complex query or post-processing
      if (sortBy) {
        switch (sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'price-asc':
            query = query.order('price', { ascending: true, nullsFirst: false }); // Handle null prices
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false, nullsFirst: false }); // Handle null prices
            break;
          // case 'rating': 
            // TODO: Implement rating sort - requires calculating average rating first
            // For now, default sort or sort by newest if rating is selected
            // query = query.order('created_at', { ascending: false }); 
            // break;
          default:
             query = query.order('created_at', { ascending: false });
        }
      } else {
        // Default sort
        query = query.order('created_at', { ascending: false });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      // Calculate average rating for each listing
      const listingsWithAvgRating = data?.map(listing => {
        // Type assertion needed because Supabase types might not perfectly reflect the nested select
        const reviews = (listing.reviews as unknown as { rating: number }[]) || []; 
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average_rating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0;
        
        // Remove the nested reviews array after calculation if not needed downstream
        // Remove the nested reviews array after calculation
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { reviews: _, ...listingData } = listing;

        // Ensure the returned object conforms to MarketListing
        return {
          ...(listingData as Tables<'listings'>), // Cast to ensure all original fields are included
          average_rating,
        };
      }) || [];
      
      // Perform client-side sorting for 'rating' after calculating averages
      if (sortBy === 'rating') {
         listingsWithAvgRating.sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0));
      }

      // Now the type should match MarketListing[]
      setListings(listingsWithAvgRating);

    } catch (err) {
      console.error("Error fetching market listings:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, sortBy, limit]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]); // Depend on the memoized fetch function

  return { listings, loading, error, refetch: fetchListings };
};
