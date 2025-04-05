
// Common types used across the application

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  is_tourist?: boolean;
  stay_duration?: number;
  interests?: string[];
  dietary_preferences?: string[];
}

export type InfoWindowState = {
  isOpen: boolean;
  position: { lat: number; lng: number } | null;
  content: React.ReactNode;
};
