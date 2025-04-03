-- Add the username column to the profiles table
alter table public.profiles
add column username text unique;

-- Add constraint to ensure username is at least 3 characters long if not null
alter table public.profiles
add constraint username_length check (username is null or length(username) >= 3);

-- Add RLS policy to allow users to update their own username
-- Assuming existing policies allow users to update their own profiles
-- If specific update policies exist, they might need adjustment.
-- This policy allows update if the user owns the profile.
drop policy if exists "Users can update their own profile." on public.profiles; -- Drop existing if it conflicts or is too broad

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Optional: Add policy to allow reading the username (adjust based on needs)
-- If profiles are public or readable by authenticated users, ensure username is included.
-- Example: Allow authenticated users to read all profiles (adjust if needed)
drop policy if exists "Allow authenticated users to read profiles" on public.profiles; -- Example drop

-- Change policy to allow users to read only their own profile
create policy "Users can view their own profile." on public.profiles
  for select using (auth.uid() = id);

-- Note: You might need more specific RLS policies depending on your application's requirements.
-- For example, preventing users from changing username too often, etc.

-- Backfill existing users with a default username if necessary (e.g., from email)
-- This is commented out as it requires careful consideration and might not be desired.
-- update public.profiles
-- set username = substring(email from '(.*)@') -- Example: derive from email
-- where username is null;
-- Ensure the users table has an email column accessible here or join appropriately.
