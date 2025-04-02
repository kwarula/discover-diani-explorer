
// Note: This is a simplified version of the database types
// The Supabase types integration is defined in src/integrations/supabase/types.ts

import { Database } from '@/integrations/supabase/types'; 

// Define Profile type based on the auto-generated Supabase types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type Operator = Database['public']['Tables']['operators']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type OperatorGalleryMedia = Database['public']['Tables']['operator_gallery_media']['Row'];
export type OperatorVerificationDocument = Database['public']['Tables']['operator_verification_documents']['Row'];

// Define possible operator statuses
export type OperatorStatus = 'pending_verification' | 'verified' | 'rejected' | 'needs_info';

// Define utility type for queries
export type Tables = Database['public']['Tables'];
