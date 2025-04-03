-- Ensure the points_of_interest table exists
create table if not exists public.points_of_interest (
    id bigint generated by default as identity primary key -- Base table with primary key
);

-- Add columns individually if they don't exist
alter table public.points_of_interest
    add column if not exists created_at timestamp with time zone not null default now(),
    add column if not exists name text not null,
    add column if not exists description text,
    add column if not exists history text,
    add column if not exists latitude double precision,
    add column if not exists longitude double precision,
    add column if not exists image_urls text[], -- Array of image URLs
    add column if not exists access_notes text, -- Information on fees, hours, guides needed etc.
    add column if not exists category text; -- e.g., 'Historical', 'Natural Landmark', 'Cultural Site'

-- Add RLS (Row Level Security) policies (These might fail if already exist, but Supabase handles this gracefully usually)
alter table public.points_of_interest enable row level security;

-- Allow public read access (Create policy if not exists - more robust, but standard CREATE POLICY works too)
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow public read access to points of interest' and polrelid = 'public.points_of_interest'::regclass) then
        create policy "Allow public read access to points of interest"
        on public.points_of_interest
        for select using (true);
    end if;
end $$;

-- Allow authenticated users (or admins) to insert (adjust role as needed)
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow authenticated users to insert points of interest' and polrelid = 'public.points_of_interest'::regclass) then
        create policy "Allow authenticated users to insert points of interest"
        on public.points_of_interest
        for insert with check (auth.role() = 'authenticated'); -- Or check for a specific admin role
    end if;
end $$;

-- Allow authenticated users (or admins) to update (adjust role as needed)
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow authenticated users to update points of interest' and polrelid = 'public.points_of_interest'::regclass) then
        create policy "Allow authenticated users to update points of interest"
        on public.points_of_interest
        for update using (auth.role() = 'authenticated'); -- Or check for a specific admin role
    end if;
end $$;

-- Allow authenticated users (or admins) to delete (adjust role as needed)
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow authenticated users to delete points of interest' and polrelid = 'public.points_of_interest'::regclass) then
        create policy "Allow authenticated users to delete points of interest"
        on public.points_of_interest
        for delete using (auth.role() = 'authenticated'); -- Or check for a specific admin role
    end if;
end $$;


-- Optional: Add comments to columns for clarity (These will only succeed if the column exists)
-- Wrap in functions to avoid errors if columns don't exist (more complex)
-- For simplicity, we'll let them potentially fail silently if a column is missing,
-- as the primary goal is ensuring the table structure.
comment on column public.points_of_interest.name is 'The common name of the point of interest.';
comment on column public.points_of_interest.description is 'A short description of the POI.';
comment on column public.points_of_interest.history is 'Historical significance or background information.';
comment on column public.points_of_interest.latitude is 'GPS latitude coordinate.';
comment on column public.points_of_interest.longitude is 'GPS longitude coordinate.';
comment on column public.points_of_interest.image_urls is 'Array of URLs pointing to images of the POI.';
comment on column public.points_of_interest.access_notes is 'Practical information like entrance fees, opening hours, guide recommendations.';
comment on column public.points_of_interest.category is 'Categorization for filtering, e.g., Historical, Natural Landmark.';
