
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PointOfInterest, POICategory } from '@/types/database';

// Function to fetch all POIs with optional category filter
export const usePOIs = (category?: POICategory) => {
  const fetchPOIs = async () => {
    try {
      // Use 'from' method with type assertion
      let query = supabase
        .from('points_of_interest')
        .select('*') as any;
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data as PointOfInterest[];
    } catch (error) {
      console.error('Error fetching points of interest:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['points_of_interest', category],
    queryFn: fetchPOIs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Function to fetch a single POI by ID
export const usePOI = (id: string | undefined) => {
  const fetchPOI = async () => {
    if (!id) return null;
    
    try {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as PointOfInterest;
    } catch (error) {
      console.error('Error fetching point of interest:', error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['point_of_interest', id],
    queryFn: fetchPOI,
    enabled: !!id, // Only run the query if we have an ID
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Helper function to get a human-readable category name
export const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'historical_site': 'Historical Site',
    'natural_feature': 'Natural Feature',
    'cultural_site': 'Cultural Site',
    'conservation_site': 'Conservation Site',
    'viewpoint': 'Viewpoint',
    'beach_area': 'Beach Area'
  };
  
  return categoryMap[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to get an icon for each category
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'historical_site':
      return 'landmark';
    case 'natural_feature':
      return 'palmtree';
    case 'cultural_site':
      return 'building';
    case 'conservation_site':
      return 'leaf';
    case 'viewpoint':
      return 'mountain';
    case 'beach_area':
      return 'umbrella';
    default:
      return 'map-pin';
  }
};
