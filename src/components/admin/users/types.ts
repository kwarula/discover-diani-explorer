// Defines the structure for User data used in the admin dashboard

// Reverted: Removed role and status to match current implementation state
export type User = {
  id: string; // UUID from Supabase auth.users or profiles
  full_name: string | null; // From profiles table
  email: string | null; // From auth.users table (currently placeholder)
  // role: 'user' | 'admin' | 'moderator'; // Removed
  // status: 'active' | 'suspended' | 'banned'; // Removed
  created_at: string; // Timestamp string from auth.users or profiles
};
