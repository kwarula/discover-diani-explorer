import type { Database } from '@/types/database'; // Import the auto-generated DB types

// Define the POI type based on the Supabase schema row
// Selecting specific fields relevant for the admin management table
export type POI = Pick<
  Database['public']['Tables']['points_of_interest']['Row'],
  'id' | 'name' | 'category' | 'featured' | 'created_at' | 'updated_at'
  // Add other fields like 'description', 'latitude', 'longitude' if needed for quick view or edit form later
>;

// Define possible POI categories if needed for filtering (align with POICategory enum)
export type POICategoryType = 'historical_site' | 'natural_feature' | 'cultural_site' | 'conservation_site' | 'viewpoint' | 'beach_area';
