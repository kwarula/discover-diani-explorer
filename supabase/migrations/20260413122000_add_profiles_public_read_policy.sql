-- Enable RLS on the profiles table if not already enabled
-- (This ensures RLS is active before adding policies)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it already exists (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;

-- Policy: Allow public read access to profiles
-- This allows anyone (authenticated or anonymous) to select profiles.
-- IMPORTANT: This grants row-level access. Column access depends on the specific SELECT query.
-- Ensure queries only select non-sensitive columns for public users.
CREATE POLICY "Allow public read access to profiles"
ON public.profiles
FOR SELECT
USING (true); -- Allows selection for any row

-- Add a comment explaining the policy
COMMENT ON POLICY "Allow public read access to profiles" ON public.profiles
IS 'Allows any user (public) to view profiles. Ensure queries select only non-sensitive columns.';
