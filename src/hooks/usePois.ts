
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PointOfInterest } from '@/types/database';

// Define the shape of the hook's return value
interface UsePoisReturn {
  pois: PointOfInterest[];
  loading: boolean;
  error: string | null;
  refetch: () => void; // Function to manually refetch data
}

const usePois = (): UsePoisReturn => {
  const [pois, setPois] = useState<PointOfInterest[]>([]);
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
        .from('points_of_interest')
        .select(poiColumns)
        .order('name'); // Default ordering by name

      if (dbError) {
        console.error("Supabase POI fetch error:", dbError);
        throw dbError;
      }

      // Use type assertion as type inference might be unreliable
      setPois((data as PointOfInterest[]) || []);

    } catch (err: any) {
      console.error("Error fetching POIs:", err);
      setError(err.message || "Failed to load points of interest.");
      setPois([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPois();
  }, []); // Fetch on initial mount

  return { pois, loading, error, refetch: fetchPois };
};

export default usePois;
