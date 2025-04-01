
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_tourist: boolean;
  stay_duration: number | null;
  dietary_preferences: string[] | null;
  interests: string[] | null;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string | null;
  price: number;
  price_unit: string | null;
  location: string;
  images: string[];
  featured: boolean;
  rating: number;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  listing_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}
