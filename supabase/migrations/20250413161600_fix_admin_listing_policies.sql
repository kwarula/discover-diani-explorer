-- Drop existing policies that directly query auth.users
DROP POLICY IF EXISTS "Admins can view all listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can update all listings" ON public.listings;

-- Recreate policies using get_my_role() function
CREATE POLICY "Admins can view all listings"
ON public.listings
FOR SELECT
TO authenticated
USING (get_my_role() = 'admin'::user_role);

CREATE POLICY "Admins can update all listings"
ON public.listings
FOR UPDATE
TO authenticated
USING (get_my_role() = 'admin'::user_role)
WITH CHECK (get_my_role() = 'admin'::user_role);

-- Note: The original policies were slightly different in structure (one had WITH CHECK, one didn't).
-- This version applies the admin check consistently for both USING and WITH CHECK clauses where applicable.
-- It also targets 'authenticated' users, assuming admins must be logged in.
