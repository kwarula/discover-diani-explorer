
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PointOfInterest } from '@/types/supabase'; // Updated import

// Define the shape of the hook's return value
interface UsePoisReturn {
  pois: PointOfInterest[]; // Updated type
  loading: boolean;
  error: string | null;
  refetch: () => void; // Function to manually refetch data
}

// Define the parameters for the hook
interface UsePoisParams {
  searchQuery?: string | null;
  category?: string | null;
  location?: string | null; // Keep for potential future use (e.g., distance filtering)
  currentTime?: string | null; // Optional: Current time in 'HH:MM:SS' format for time-based filtering
  requiredTags?: string[] | null; // Optional: Tags to filter by when using currentTime
}

// Update hook signature to accept new filters including time and tags
const usePois = (
  {
    searchQuery,
    category,
    location,
    currentTime,
    requiredTags,
  }: UsePoisParams = {}
): UsePoisReturn => {
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize fetchPois based on filters
  const fetchPois = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Create an abort controller for the timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 20000); // 20 second timeout

    try {
      let data: PointOfInterest[] | null = null;
      let dbError: any = null;

      if (currentTime) {
        // Since the RPC function is not available, we'll use a standard query instead
        console.log(`Fetching POIs with time filtering - fallback to standard query`);
        
        const { data: selectData, error: selectError } = await supabase
          .from('points_of_interest')
          .select('*') // Select all POIs for now
          .abortSignal(abortController.signal);

        data = selectData;
        dbError = selectError;
      } else {
        // --- Use standard select query for non-time-based filtering ---
        console.log(`Fetching POIs using SELECT with category: ${category}, search: ${searchQuery}`);
        // Select all columns
        let query = supabase
          .from('points_of_interest')
          .select()
          .abortSignal(abortController.signal);

        // Apply standard filters
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        if (searchQuery) {
          // Simple search on name and description.
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        // Fetch data based on constructed query
        const { data: selectData, error: selectError } = await query.order('name');

        data = selectData;
        dbError = selectError;
      }

      clearTimeout(timeoutId); // Clear timeout if fetch completes/errors before timeout

      // Handle potential errors or timeouts
      if (abortController.signal.aborted) {
        console.error("POI fetch aborted (timeout)");
        throw new Error("Request timed out");
      }
      if (dbError) {
        console.error("Supabase POI fetch error:", dbError);
        throw dbError;
      }

      // Set state with fetched data
      setPois(data || []);

    } catch (err: any) {
      console.error("Error in fetchPois:", err);
      // Set specific error messages
      if (err.message === "Request timed out") {
        setError("Fetching points of interest timed out. Please try again.");
      } else if (err.message?.includes("Failed to fetch")) {
        setError("Network error. Could not fetch points of interest.");
      } else {
        setError(err.message || "An unknown error occurred while fetching points of interest.");
      }
      setPois([]); // Clear POIs on error
    } finally {
      clearTimeout(timeoutId); // Ensure timeout is cleared
      setLoading(false);
    }
  }, [searchQuery, category, location, currentTime, requiredTags]); // Include currentTime and requiredTags in dependencies

  useEffect(() => {
    fetchPois(); // Initial fetch

    // Set up realtime subscription
    const channel = supabase
      .channel('public:points_of_interest')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'points_of_interest' },
        (payload) => {
          console.log('Realtime POI change received!', payload);
          // Refetch data when the table changes
          fetchPois();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount or when filters change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPois]); // useEffect depends on the memoized fetchPois

  // Return state and the refetch function
  return { pois, loading, error, refetch: fetchPois };
};

export default usePois;
