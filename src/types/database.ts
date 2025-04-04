
export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  username: string | null;
  full_name: string | null;
  dietary_preferences: string[] | null;
  interests: string[] | null;
  stay_duration: number | null;
  avatar_url: string | null;
  bio: string | null;
  is_tourist: boolean | null;
};

export type Listing = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
  description: string | null;
  category: string | null;
  sub_category: string | null;
  location: string | null;
  price: number | null;
  price_unit: string | null;
  price_range: string | null;
  images: string[] | null;
  status: string;
  featured: boolean;
  user_id: string | null;
  is_verified: boolean | null;
  tide_dependency: string | null;
  guide_recommended: boolean | null;
  wildlife_notice: string | null;
  transport_instructions: string | null;
};

export type Operator = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  business_name: string;
  business_type: string;
  contact_person_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  address_street: string | null;
  address_area: string | null;
  address_city: string | null;
  address_country: string | null;
  cover_photo_url: string | null;
  logo_url: string | null;
  description: string | null;
  key_offerings: string[] | null;
  categories: string[] | null;
  price_range: string | null;
  operating_hours: any | null; // Consider a more specific type
  service_area_description: string | null;
  location_coordinates: any | null; // Consider a more specific type
  is_verified: boolean | null;
  specialties: string[] | null;
};

export type PointOfInterest = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  history: string | null;
  category: string;
  latitude: number;
  longitude: number;
  image_urls: string[] | null;
  images: string[] | null;
  access_notes: string | null;
  featured: boolean | null;
  guide_required: boolean | null;
  entrance_fee: string | null;
  best_visit_time: string | null;
  significance: string | null;
};

export type Review = {
  id: string;
  created_at: string;
  user_id: string;
  listing_id: string | null;
  operator_id: string | null;
  rating: number;
  comment: string | null;
  used_guide: boolean | null;
};

export type FlaggedContent = {
  id: string;
  content_id: string;
  content_type: 'Review' | 'Comment' | 'Listing' | 'OperatorProfile';
  content_snippet: string | null;
  reason: string | null;
  reported_by_user_id: string | null;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  reported_at: string;
  resolved_at: string | null;
  resolved_by_user_id: string | null;
  moderator_notes: string | null;
};

// Add this export to fix the imported type errors
export namespace Tables {
  export interface Listings extends Listing {}
  export interface Profiles extends Profile {}
  export interface Operators extends Operator {}
  export interface PointsOfInterest extends PointOfInterest {}
  export interface Reviews extends Review {}
  export interface FlaggedContent extends FlaggedContent {}
}

export type { Database } from '@/integrations/supabase/types';
