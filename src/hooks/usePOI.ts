
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PointOfInterest, POICategory } from '@/types/supabase';

interface UsePOIResult {
  data: PointOfInterest | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePOIsResult {
  data: PointOfInterest[];
  isLoading: boolean;
  error: string | null;
}

// Hook for fetching a single POI by ID
export const usePOI = (id: string | undefined): UsePOIResult => {
  const [data, setData] = useState<PointOfInterest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPOI = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('points_of_interest')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setData(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPOI();
  }, [id]);

  return { data, isLoading, error };
};

// Hook for fetching all POIs
export const usePOIs = (): UsePOIsResult => {
  const [data, setData] = useState<PointOfInterest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOIs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('points_of_interest')
          .select('*');

        if (error) {
          setError(error.message);
        } else {
          setData(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPOIs();
  }, []);

  return { data, isLoading, error };
};

// Helper function to get category name
export const getCategoryName = (category: string): string => {
  switch (category) {
    case 'historical_site':
      return 'Historical Site';
    case 'natural_feature':
      return 'Natural Feature';
    case 'cultural_site':
      return 'Cultural Site';
    case 'conservation_site':
      return 'Conservation Site';
    case 'viewpoint':
      return 'Viewpoint';
    case 'beach_area':
      return 'Beach Area';
    default:
      return 'Point of Interest';
  }
};

// Helper function to get category icon
export const getCategoryIcon = (category: string): JSX.Element => {
  switch (category) {
    case 'historical_site':
      return <span role="img" aria-label="historical site">🏛️</span>;
    case 'natural_feature':
      return <span role="img" aria-label="natural feature">🏞️</span>;
    case 'cultural_site':
      return <span role="img" aria-label="cultural site">🎭</span>;
    case 'conservation_site':
      return <span role="img" aria-label="conservation site">🌿</span>;
    case 'viewpoint':
      return <span role="img" aria-label="viewpoint">⛰️</span>;
    case 'beach_area':
      return <span role="img" aria-label="beach area">🏖️</span>;
    default:
      return <span role="img" aria-label="point of interest">📍</span>;
  }
};
