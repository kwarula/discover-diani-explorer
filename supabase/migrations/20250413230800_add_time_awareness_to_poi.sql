-- Add columns for time-based filtering and activity tagging to points_of_interest

alter table public.points_of_interest
    add column if not exists opening_time time null, -- Stores the opening time (e.g., '08:00:00'). Null if not applicable (e.g., beaches).
    add column if not exists closing_time time null, -- Stores the closing time (e.g., '17:00:00'). Null if always open or not applicable.
    add column if not exists activity_tags text[] null; -- Array of tags like {'daytime_only', 'nightlife', 'low_tide_dependent', 'restaurant', 'bar', 'beach_access'}

-- Add comments to the new columns for clarity
comment on column public.points_of_interest.opening_time is 'The time the point of interest typically opens. Assumes local timezone (EAT/UTC+3).';
comment on column public.points_of_interest.closing_time is 'The time the point of interest typically closes. Assumes local timezone (EAT/UTC+3).';
comment on column public.points_of_interest.activity_tags is 'Tags for filtering activities based on time, conditions, or type (e.g., daytime_only, nightlife, low_tide_dependent).';

-- Optional: Consider adding an index if querying frequently by tags
-- create index if not exists idx_poi_activity_tags on public.points_of_interest using gin (activity_tags);
