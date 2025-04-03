-- Add new fields to the listings table
alter table public.listings
add column if not exists is_verified boolean default false,
add column if not exists tide_dependency text, -- e.g., 'low_tide_best', 'high_tide_accessible', 'none'
add column if not exists guide_recommended boolean default false,
add column if not exists wildlife_notice text,
add column if not exists transport_instructions text,
add column if not exists price_range text; -- e.g., '$', '$$', '$$$' or specific ranges

-- Add new fields to the operators table
alter table public.operators
add column if not exists is_verified boolean default false,
add column if not exists specialties text[]; -- Array of strings like 'Tiwi Excursions', 'Historical Tours'

-- Add comments for clarity
comment on column public.listings.is_verified is 'Indicates if the listing information has been verified by an admin.';
comment on column public.listings.tide_dependency is 'Describes if the listing/activity is best visited at specific tide levels.';
comment on column public.listings.guide_recommended is 'Indicates if a guide is highly recommended for this listing/activity.';
comment on column public.listings.wildlife_notice is 'Optional note about local wildlife (e.g., monkeys).';
comment on column public.listings.transport_instructions is 'Detailed instructions on how to get to the location.';
comment on column public.listings.price_range is 'A general indicator of the price level.';

comment on column public.operators.is_verified is 'Indicates if the operator (e.g., guide, driver) has been verified.';
comment on column public.operators.specialties is 'List of specialties or services offered by the operator.';
