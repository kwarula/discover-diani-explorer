-- Create a user status enum type
create type public.user_status as enum ('active', 'suspended', 'banned');

-- Add the status column to the profiles table
alter table public.profiles
add column status public.user_status not null default 'active';

-- Optional: Add an index for faster status lookups
create index idx_profiles_status on public.profiles (status);

-- Update RLS policy for profiles to allow admins to update status
-- Drop the existing policy first
drop policy if exists "Allow users to update their own profile" on public.profiles;
drop policy if exists "Allow admin full access on profiles" on public.profiles;

-- Recreate policies allowing admin full access and users to update their own (excluding role/status)
create policy "Allow admin full access on profiles" on public.profiles
  for all using (public.get_my_role() = 'admin');

create policy "Allow users to update their own profile (non-sensitive fields)" on public.profiles
  for update using (auth.uid() = id) with check (
    auth.uid() = id and
    -- Prevent users from changing their own role or status
    role = (select role from public.profiles where id = auth.uid()) and
    status = (select status from public.profiles where id = auth.uid())
  );

-- Re-add the read policy (might have been dropped if dependent)
drop policy if exists "Allow users to read all profiles" on public.profiles;
create policy "Allow users to read all profiles" on public.profiles
  for select using (true);
