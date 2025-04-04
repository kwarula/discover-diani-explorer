-- Enable RLS on the profiles table if not already enabled
-- (It should be enabled if SELECT policies exist, but this ensures it)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

-- Policy: Allow users to insert their own profile
-- The check ensures the 'id' being inserted matches the authenticated user's ID
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Allow users to update their own profile
-- The using clause specifies which rows the policy applies to (rows where id matches the user's uid)
-- The with check clause ensures that any updated row still meets the condition (id cannot be changed to someone else's uid)
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Note: The existing SELECT policy "Users can view their own profile." allows users to read their profile.
-- No DELETE policy is added here by default. Add one if users should be able to delete their profiles.
