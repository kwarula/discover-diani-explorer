// Defines the structure for user data fetched for the admin dashboard

// Matches the return type of the get_admin_users() Supabase function
export type User = {
  id: string; // uuid from profiles/auth.users
  full_name: string | null; // from profiles
  email: string | null; // from auth.users
  role: 'user' | 'admin' | 'moderator' | string | null; // from profiles (allow string for flexibility)
  status: 'active' | 'suspended' | 'banned' | string | null; // from profiles (allow string for flexibility)
  created_at: string; // timestamptz from profiles or auth.users
};

// Define specific types for roles and statuses if needed elsewhere
export type UserRole = 'user' | 'admin' | 'moderator';
export type UserStatus = 'active' | 'suspended' | 'banned';
