import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database';

// Using 'any' as a workaround for persistent type issues
type ReviewData = any;

interface UseReviewsProps {
  listingId?: string;
  operatorId?: string;
  initialFetch?: boolean; // Control whether to fetch on mount
}

interface UseReviewsReturn {
  reviews: ReviewData[]; // Use any
  loading: boolean;
  error: string | null;
  fetchReviews: () => void; // Function to manually trigger fetch
}

const useReviews = ({ listingId, operatorId, initialFetch = true }: UseReviewsProps): UseReviewsReturn => {
  const [reviews, setReviews] = useState<ReviewData[]>([]); // Use any
  const [loading, setLoading] = useState<boolean>(initialFetch); // Only load initially if requested
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    // Ensure we have at least one ID to filter by
    if (!listingId && !operatorId) {
      // setError("Either listingId or operatorId is required to fetch reviews.");
      // setReviews([]); // Clear reviews if no ID provided
      // setLoading(false); // Stop loading if no ID
      // Or decide to fetch all reviews? For now, we'll just return empty.
      console.warn("useReviews: No listingId or operatorId provided.");
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Define columns to select (basic review fields only)
      const reviewColumns = `
        id, created_at, user_id, listing_id, operator_id, rating, comment, used_guide
      `;

      let query = supabase
        .from('reviews')
        .select(reviewColumns);

      // Apply filters based on provided IDs
      if (listingId) {
        query = query.eq('listing_id', listingId);
      } else if (operatorId) {
        query = query.eq('operator_id', operatorId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: dbError } = await query;

      if (dbError) {
        console.error("Supabase review fetch error:", dbError);
        throw dbError;
      }

      // Set state directly without assertion, relying on runtime structure
      setReviews(data || []);

    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      setError(err.message || "Failed to load reviews.");
      setReviews([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, [listingId, operatorId]); // Dependency array includes IDs

  useEffect(() => {
    if (initialFetch) {
      fetchReviews();
    }
  }, [fetchReviews, initialFetch]); // Fetch on initial mount if requested

  return { reviews, loading, error, fetchReviews };
};

export default useReviews;
