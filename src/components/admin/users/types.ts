// Defines the structure for User data used in the admin dashboard

export type User = {
  id: string; // UUID from Supabase auth.users or profiles
  full_name: string | null; // From profiles table
  email: string | null; // From auth.users table
  role: 'Tourist' | 'Local' | 'Operator' | 'Admin' | string; // Example roles, adjust as needed
  status: 'Active' | 'Suspended' | string; // Example statuses
  created_at: string; // Timestamp string from auth.users or profiles
};
