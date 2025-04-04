-- Create a user role enum type
create type public.user_role as enum ('user', 'admin', 'moderator');

-- Add the role column to the profiles table
alter table public.profiles
add column role public.user_role not null default 'user';

-- Optional: Add an index for faster role lookups
create index idx_profiles_role on public.profiles (role);

-- Optional: Grant usage on the new type to relevant roles if needed
-- grant usage on type public.user_role to authenticated, service_role;

-- Update existing profiles if necessary (example: set a specific user as admin)
-- update public.profiles
-- set role = 'admin'
-- where id = 'some-user-uuid';
