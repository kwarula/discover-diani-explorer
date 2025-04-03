import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/types/database';

// Define the shape of the hook's return value
interface UsePoisReturn {
  pois: Tables<'points_of_interest'>[];
  loading: boolean;
  error: string | null;
  refetch: () => void; // Function to manually refetch data
}

const usePois = (): UsePoisReturn => {
  const [pois, setPois] = useState<Tables<'points_of_interest'>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPois = async () => {
    setLoading(true);
    setError(null);
    try {
      // Explicitly select columns to match the type definition
      const poiColumns = `
        id, access_notes, best_visit_time, category, created_at, description,
        entrance_fee, featured, guide_required, history, image_urls, images,
        latitude, longitude, name, significance, updated_at
      `;
      const { data, error: dbError } = await supabase
        .from('points_of_interest' as any) // Re-adding workaround
        .select(poiColumns)
        .order('name'); // Default ordering by name

      if (dbError) {
        console.error("Supabase POI fetch error:", dbError);
        throw dbError;
      }

      // Use type assertion as type inference might be unreliable
      setPois((data as Tables<'points_of_interest'>[]) || []);

    } catch (err: any) { // Missing closing brace was likely here or after finally
      console.error("Error fetching POIs:", err);
      setError(err.message || "Failed to load points of interest.");
      setPois([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }; // Added missing closing brace for fetchPois function

  useEffect(() => {
    fetchPois();
  }, []); // Fetch on initial mount

  return { pois, loading, error, refetch: fetchPois };
};

export default usePois;
