import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database'; // Import Tables type

// Define the shape of the hook's return value
interface UsePoisReturn {
  pois: Tables<'points_of_interest'>[]; // Use Tables type
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
  const [pois, setPois] = useState<Tables<'points_of_interest'>[]>([]); // Use Tables type
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
      let data: Tables<'points_of_interest'>[] | null = null;
      let dbError: any = null;

      if (currentTime) {
        // --- Use RPC function for time-based filtering ---
        console.log(`Fetching POIs using RPC with time: ${currentTime}, tags: ${requiredTags}`);
        const rpcParams = {
          current_time_input: currentTime,
          required_tags: requiredTags || null, // Pass null if undefined/null
        };
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_relevant_pois', rpcParams)
          .abortSignal(abortController.signal); // Pass signal to RPC call

        data = rpcData;
        dbError = rpcError;
        // Note: Ordering might need to be done client-side or by modifying the RPC function itself.

      } else {
        // --- Use standard select query for non-time-based filtering ---
        console.log(`Fetching POIs using SELECT with category: ${category}, search: ${searchQuery}`);
        // Explicitly select columns including new ones
        const poiColumns = `
          id, name, description, category, latitude, longitude, history, access_notes,
          guide_required, image_urls, created_at, opening_time, closing_time, activity_tags
        `; // Added new columns

        let query = supabase
          .from('points_of_interest')
          .select(poiColumns)
          .abortSignal(abortController.signal); // Pass signal to select call

        // Apply standard filters
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        if (searchQuery) {
          // Simple search on name and description.
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        // Note: Location filtering is not implemented here.

        // Fetch data based on constructed query
        const { data: selectData, error: selectError } = await query.order('name'); // Order results by name

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
          // Refetch data when the table changes, using the memoized fetchPois
          // which already captures the current filter/time/tag state.
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
