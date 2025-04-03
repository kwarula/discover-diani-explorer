
import { Database as GeneratedDatabase } from '@/integrations/supabase/types';

// Re-export Json type from the generated types
export type { Json } from '@/integrations/supabase/types';

// Extend the generated Database type interface
export interface Database extends Omit<GeneratedDatabase, 'public'> {
  public: GeneratedDatabase['public'];
}

// Export Tables helper type for components to use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Operator = Database['public']['Tables']['operators']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type PointOfInterest = Database['public']['Tables']['points_of_interest']['Row'];
export type FlaggedContent = Database['public']['Tables']['flagged_content']['Row'];

export type OperatorStatus = 'pending_verification' | 'verified' | 'rejected' | 'needs_info' | 'suspended';

export type TideDependency = 'low_tide_only' | 'high_tide_only' | 'mid_to_high_tide' | 'any_tide' | null;

export type POICategory = 'historical_site' | 'natural_feature' | 'cultural_site' | 'conservation_site' | 'viewpoint' | 'beach_area';
