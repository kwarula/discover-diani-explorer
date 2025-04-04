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
    
    // Create an abort controller for the timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 10000); // 10 second timeout
    
    try {
      // Explicitly select columns to match the type definition
      const poiColumns = `
        id, access_notes, best_visit_time, category, created_at, description,
        entrance_fee, featured, guide_required, history, image_urls, images,
        latitude, longitude, name, significance, updated_at
      `;
      
      // Limit query to just 5 featured POIs to improve initial load performance
      const { data, error: dbError } = await supabase
        .from('points_of_interest')
        .select(poiColumns)
        .eq('featured', true)
        .order('name')
        .limit(5);

      clearTimeout(timeoutId);
      
      if (abortController.signal.aborted) {
        throw new Error("Request timed out");
      }
      
      if (dbError) {
        console.error("Supabase POI fetch error:", dbError);
        throw dbError;
      }

      // Use type assertion as type inference might be unreliable
      setPois((data as PointOfInterest[]) || []);

    } catch (err: any) {
      console.error("Error fetching POIs:", err);
      
      if (err.message === "Request timed out") {
        setError("Request timed out. Please try again later.");
      } else if (err.message?.includes("Failed to fetch")) {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.message || "Failed to load points of interest.");
      }
      
      // Provide fallback data for development - can be removed in production
      if (import.meta.env.DEV) {
        setPois([
          {
            id: 'fallback-1',
            name: 'Diani Beach',
            category: 'beach',
            featured: true,
            latitude: -4.2767,
            longitude: 39.5867,
            description: 'Beautiful white sand beach',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as PointOfInterest,
          {
            id: 'fallback-2',
            name: 'Kongo River',
            category: 'natural_feature',
            featured: true,
            latitude: -4.3106,
            longitude: 39.5780,
            description: 'Scenic river with wildlife',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as PointOfInterest
        ]);
      } else {
        setPois([]); // Clear data on error in production
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPois();
    
    // Subscribe to realtime changes on the points_of_interest table
    const poiSubscription = supabase
      .channel('public:points_of_interest')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'points_of_interest' 
      }, () => {
        // Refetch data when the table changes
        fetchPois();
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(poiSubscription);
    };
  }, []); // Fetch on initial mount

  return { pois, loading, error, refetch: fetchPois };
};

export default usePois;
