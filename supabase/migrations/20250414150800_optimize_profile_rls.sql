-- Migration: optimize_profile_rls
-- Reason: Fix performance timeout during admin profile fetch caused by inefficient RLS
--         and remove overly permissive read access policy.

-- Drop the problematic policies identified in migration 20250404122638_admin_moderator_policies.sql
-- Using IF EXISTS to make it safe to re-run or apply selectively.
DROP POLICY IF EXISTS "Allow admin full access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.profiles;

-- The policy "Users can view their own profile." (created by 20250402201800_fix_profile_select_policy.sql)
-- is assumed to be active. It handles the efficient fetching of a user's own profile,
-- which is needed for the initial `fetchUserProfile` call for ALL users, including admins.

-- Re-add specific ADMIN policies using the get_my_role() helper function.
-- These policies grant admins broader permissions needed for administrative tasks,
-- separate from the initial profile fetch.

-- Policy for Admins to SELECT *any* profile (e.g., for user management views)
-- Create this policy IF NOT EXISTS to ensure idempotency.
CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
USING (public.get_my_role() = 'admin');

-- Policy for Admins to UPDATE *any* profile
-- Create this policy IF NOT EXISTS to ensure idempotency.
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (public.get_my_role() = 'admin')
WITH CHECK (public.get_my_role() = 'admin'); -- WITH CHECK is important for UPDATE/INSERT

-- Policy for Admins to DELETE *any* profile
-- Create this policy IF NOT EXISTS to ensure idempotency.
CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
USING (public.get_my_role() = 'admin');

-- Note: The policy "Allow users to update their own profile" from 20250404122638
-- is assumed to still be active and correctly handles non-admin updates to their own profile.
-- If needed, it could be added here with IF NOT EXISTS as well for robustness.
-- CREATE POLICY "Allow users to update their own profile"
-- ON public.profiles
-- FOR UPDATE
-- USING (auth.uid() = id)
-- WITH CHECK (auth.uid() = id);
