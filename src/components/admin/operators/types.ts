import type { Database } from '@/types/database'; // Import the auto-generated DB types

// Define the Operator type based on the Supabase schema row
// Selecting specific fields relevant to the admin table
export type Operator = Pick<
  Database['public']['Tables']['operators']['Row'],
  'id' | 'business_name' | 'contact_person_name' | 'contact_email' | 'status' | 'created_at'
>;

// Define possible statuses explicitly if needed, aligning with DB constraints/usage
export type OperatorStatus = 'pending_verification' | 'verified' | 'rejected' | 'suspended';
