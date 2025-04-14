-- Helper function to get the role of the currently authenticated user
create or replace function public.get_my_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

-- Grant execute permission on the function to authenticated users
grant execute on function public.get_my_role() to authenticated;

-- == PROFILES ==
-- Enable RLS
alter table public.profiles enable row level security;
-- Remove existing policies if they conflict (adjust names if needed)
drop policy if exists "Allow authenticated read access" on public.profiles;
drop policy if exists "Allow individual insert access" on public.profiles;
drop policy if exists "Allow individual update access" on public.profiles;
-- Policies
drop policy if exists "Allow admin full access on profiles" on public.profiles; -- Added this line
create policy "Allow admin full access on profiles" on public.profiles
  for all using (public.get_my_role() = 'admin');
create policy "Allow users to read all profiles" on public.profiles
  for select using (true);
drop policy if exists "Allow users to update their own profile" on public.profiles; -- Added this line
create policy "Allow users to update their own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- Note: Insert is handled by trigger/function usually, but admins might need it.

-- == OPERATORS ==
-- Enable RLS
alter table public.operators enable row level security;
-- Remove existing policies if they conflict (adjust names if needed)
drop policy if exists "Enable read access for all users" on public.operators;
drop policy if exists "Allow insert access for authenticated users" on public.operators;
drop policy if exists "Allow update access for operators on their own record" on public.operators;
-- Policies
create policy "Allow admin full access on operators" on public.operators
  for all using (public.get_my_role() = 'admin');
create policy "Allow moderators read access on operators" on public.operators
  for select using (public.get_my_role() in ('admin', 'moderator')); -- Fixed comma
create policy "Allow public read access on verified operators" on public.operators
  for select using (status = 'verified');
create policy "Allow operators to manage their own record" on public.operators
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- == LISTINGS ==
-- Enable RLS
alter table public.listings enable row level security;
-- Remove existing policies if they conflict (adjust names if needed)
-- Policies
drop policy if exists "Allow admin full access on listings" on public.listings; -- Added drop
create policy "Allow admin full access on listings" on public.listings
  for all using (public.get_my_role() = 'admin');
-- Split moderator access into separate read and update policies
drop policy if exists "Allow moderators read/update access on listings" on public.listings; -- Remove old combined policy
drop policy if exists "Allow moderators read access on listings" on public.listings; -- Add drop for new policy
create policy "Allow moderators read access on listings" on public.listings
  for select using (public.get_my_role() in ('admin', 'moderator'));
drop policy if exists "Allow moderators update access on listings" on public.listings; -- Add drop for new policy
create policy "Allow moderators update access on listings" on public.listings
  for update using (public.get_my_role() in ('admin', 'moderator'));
drop policy if exists "Allow public read access on active listings" on public.listings; -- Added drop
create policy "Allow public read access on active listings" on public.listings
  for select using (status = 'active'); -- Adjust status value if needed
drop policy if exists "Allow users/operators to manage their own listings" on public.listings; -- Added drop
create policy "Allow users/operators to manage their own listings" on public.listings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id); -- Assuming user_id links listings to creators

-- == REVIEWS ==
-- Enable RLS
alter table public.reviews enable row level security;
-- Remove existing policies if they conflict (adjust names if needed)
-- Policies
create policy "Allow admin full access on reviews" on public.reviews
  for all using (public.get_my_role() = 'admin');
drop policy if exists "Allow moderators read/delete access on reviews" on public.reviews; -- Remove old combined policy
drop policy if exists "Allow moderators read access on reviews" on public.reviews; -- Add drop for new policy
create policy "Allow moderators read access on reviews" on public.reviews
  for select using (public.get_my_role() in ('admin', 'moderator'));
drop policy if exists "Allow moderators delete access on reviews" on public.reviews; -- Add drop for new policy
create policy "Allow moderators delete access on reviews" on public.reviews
  for delete using (public.get_my_role() in ('admin', 'moderator'));
create policy "Allow public read access on reviews" on public.reviews
  for select using (true);
create policy "Allow users to insert their own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);
drop policy if exists "Allow users to update/delete their own reviews" on public.reviews; -- Remove old combined policy
drop policy if exists "Allow users to update their own reviews" on public.reviews; -- Add drop for new policy
create policy "Allow users to update their own reviews" on public.reviews
  for update using (auth.uid() = user_id);
drop policy if exists "Allow users to delete their own reviews" on public.reviews; -- Add drop for new policy
create policy "Allow users to delete their own reviews" on public.reviews
  for delete using (auth.uid() = user_id);

-- == FLAGGED CONTENT ==
-- Enable RLS
alter table public.flagged_content enable row level security;
-- Remove existing policies if they conflict (adjust names if needed)
drop policy if exists "Allow authenticated users to insert flagged content" on public.flagged_content;
drop policy if exists "Allow admin/moderator read access" on public.flagged_content;
drop policy if exists "Allow admin/moderator update access" on public.flagged_content;
-- Policies
create policy "Allow admin full access on flagged_content" on public.flagged_content
  for all using (public.get_my_role() = 'admin');
drop policy if exists "Allow moderators read/update access on flagged_content" on public.flagged_content; -- Remove old combined policy
drop policy if exists "Allow moderators read access on flagged_content" on public.flagged_content; -- Add drop for new policy
create policy "Allow moderators read access on flagged_content" on public.flagged_content
  for select using (public.get_my_role() in ('admin', 'moderator'));
drop policy if exists "Allow moderators update access on flagged_content" on public.flagged_content; -- Add drop for new policy
create policy "Allow moderators update access on flagged_content" on public.flagged_content
  for update using (public.get_my_role() in ('admin', 'moderator'));
drop policy if exists "Allow authenticated users to insert flags" on public.flagged_content; -- Added drop
create policy "Allow authenticated users to insert flags" on public.flagged_content
  for insert with check (auth.role() = 'authenticated'); -- Check if reported_by_user_id should match auth.uid()

-- == POINTS OF INTEREST ==
-- Enable RLS
alter table public.points_of_interest enable row level security;
-- Remove existing policies if they conflict (adjust names if needed)
-- Policies
create policy "Allow admin full access on points_of_interest" on public.points_of_interest
  for all using (public.get_my_role() = 'admin');
create policy "Allow moderators read access on points_of_interest" on public.points_of_interest
  for select using (public.get_my_role() in ('admin', 'moderator')); -- Fixed comma
create policy "Allow public read access on points_of_interest" on public.points_of_interest
  for select using (true);
