-- This migration fixes issues with profiles table RLS policies and ensures
-- consistent handling of profile creation with proper defaults

-- First ensure get_my_role function exists (it's used in several policies)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role
LANGUAGE SQL SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'::user_role
  );
$$;

-- Drop existing insert policy for profiles
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;

-- Create a more permissive insert policy for profiles
-- This allows authenticated users to create their own profile with their user ID
CREATE POLICY "Allow users to create their own profile" ON public.profiles
FOR INSERT WITH CHECK (
  auth.uid() = id
);

-- Ensure profiles table has the expected schema with sensible defaults
ALTER TABLE public.profiles 
  ALTER COLUMN full_name SET DEFAULT '',
  ALTER COLUMN bio DROP NOT NULL,
  ALTER COLUMN avatar_url DROP NOT NULL,
  ALTER COLUMN username DROP NOT NULL,
  ALTER COLUMN interests DROP NOT NULL,
  ALTER COLUMN dietary_preferences DROP NOT NULL,
  -- Allow these fields to be null to facilitate easier profile creation
  -- We'll rely on application logic to validate and set appropriate values
  ALTER COLUMN interests SET DEFAULT NULL,
  ALTER COLUMN dietary_preferences SET DEFAULT NULL,
  ALTER COLUMN stay_duration SET DEFAULT NULL;

-- Re-create the admin access policy since we'll be dropping and recreating it
DROP POLICY IF EXISTS "Allow admin full access on profiles" ON public.profiles;

CREATE POLICY "Allow admin full access on profiles" 
ON public.profiles FOR ALL 
USING (public.get_my_role() = 'admin');

-- Create a function to auto-create profiles
-- This will be triggered on auth.users insertions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for handling new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comment on the profiles table to document expected behavior
COMMENT ON TABLE public.profiles IS 'User profiles with automatic creation on signup';
COMMENT ON COLUMN public.profiles.role IS 'User role: user, admin, or moderator';
COMMENT ON COLUMN public.profiles.status IS 'User status: active, suspended, or banned'; 