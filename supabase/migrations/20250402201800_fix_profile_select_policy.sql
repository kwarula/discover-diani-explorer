-- Drop the potentially incorrect broad policy if it exists from the previous migration attempt
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON public.profiles;

-- Drop the specific policy if it somehow exists already (to ensure idempotency)
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;

-- Create the correct policy allowing users to read only their own profile
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);
