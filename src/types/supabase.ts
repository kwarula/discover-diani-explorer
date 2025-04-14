
import { Database } from './database';

// Shortcuts for database tables
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Operator = Database['public']['Tables']['operators']['Row'];
export type PointOfInterest = Database['public']['Tables']['points_of_interest']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];

// Enum types
export type UserRole = Database['public']['Enums']['user_role'];
export type UserStatus = Database['public']['Enums']['user_status'];
export type POICategory = string; // Since it appears to be stored as a string in the DB
