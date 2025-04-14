-- Enable RLS on the listings table if not already enabled
-- (This ensures RLS is active before adding policies)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it already exists (for idempotency)
DROP POLICY IF EXISTS "Allow public read access for approved listings" ON public.listings;

-- Policy: Allow public read access for approved listings
-- This allows anyone (authenticated or anonymous) to select listings
-- but only if their status is 'approved'.
CREATE POLICY "Allow public read access for approved listings"
ON public.listings
FOR SELECT
USING (status = 'approved');

-- Add a comment explaining the policy
COMMENT ON POLICY "Allow public read access for approved listings" ON public.listings
IS 'Allows any user (public) to view listings that have been approved.';
