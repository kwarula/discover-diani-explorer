-- Indexes for listings table
-- Index for filtering by category and status (common query pattern)
create index if not exists idx_listings_category_status on public.listings (category, status);

-- Index for filtering by status alone (used in useListings)
create index if not exists idx_listings_status on public.listings (status);

-- Index for sorting by creation date (used in useListings)
create index if not exists idx_listings_created_at on public.listings (created_at desc);

-- Indexes for text search (using GIN for potential future FTS or faster ILIKE)
-- Consider using pg_trgm extension for even better ILIKE performance if needed: CREATE EXTENSION IF NOT EXISTS pg_trgm;
create index if not exists idx_listings_title_gin on public.listings using gin (title gin_trgm_ops);
create index if not exists idx_listings_description_gin on public.listings using gin (description gin_trgm_ops);
create index if not exists idx_listings_location_gin on public.listings using gin (location gin_trgm_ops);


-- Indexes for points_of_interest table
-- Index for filtering by category
create index if not exists idx_poi_category on public.points_of_interest (category);

-- Index for sorting by name (used in usePois)
create index if not exists idx_poi_name on public.points_of_interest (name);

-- Indexes for text search (using GIN)
create index if not exists idx_poi_name_gin on public.points_of_interest using gin (name gin_trgm_ops);
create index if not exists idx_poi_description_gin on public.points_of_interest using gin (description gin_trgm_ops);

-- Note: GIN indexes with gin_trgm_ops require the pg_trgm extension.
-- We need to ensure this extension is enabled in Supabase.
-- It's often enabled by default, but we should add it explicitly if needed.
create extension if not exists pg_trgm;
