-- Ensure the reviews table exists
create table if not exists public.reviews (
    id bigint generated by default as identity primary key -- Base table with primary key
);

-- Add columns individually if they don't exist
alter table public.reviews
    add column if not exists created_at timestamp with time zone not null default now(),
    add column if not exists user_id uuid references auth.users(id) on delete cascade not null,
    add column if not exists listing_id uuid references public.listings(id) on delete cascade, -- Changed bigint to uuid
    add column if not exists operator_id uuid references public.operators(id) on delete cascade, -- Changed bigint to uuid
    add column if not exists rating smallint not null check (rating >= 1 and rating <= 5),
    add column if not exists comment text,
    add column if not exists used_guide boolean; -- Optional: Did the user use a guide?

-- Add the check constraint if it doesn't exist
do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'review_target_check' and conrelid = 'public.reviews'::regclass
    ) then
        alter table public.reviews
            add constraint review_target_check check (
                (listing_id is not null and operator_id is null) or
                (listing_id is null and operator_id is not null)
            );
    end if;
end $$;

-- Add RLS (Row Level Security) policies
alter table public.reviews enable row level security;

-- Allow public read access
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow public read access to reviews' and polrelid = 'public.reviews'::regclass) then
        create policy "Allow public read access to reviews"
        on public.reviews
        for select using (true);
    end if;
end $$;

-- Allow authenticated users to insert their own reviews
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow authenticated users to insert their own reviews' and polrelid = 'public.reviews'::regclass) then
        create policy "Allow authenticated users to insert their own reviews"
        on public.reviews
        for insert with check (auth.uid() = user_id);
    end if;
end $$;

-- Allow users to update their own reviews
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow users to update their own reviews' and polrelid = 'public.reviews'::regclass) then
        create policy "Allow users to update their own reviews"
        on public.reviews
        for update using (auth.uid() = user_id);
    end if;
end $$;

-- Allow users to delete their own reviews
do $$
begin
    if not exists (select 1 from pg_policy where polname = 'Allow users to delete their own reviews' and polrelid = 'public.reviews'::regclass) then
        create policy "Allow users to delete their own reviews"
        on public.reviews
        for delete using (auth.uid() = user_id);
    end if;
end $$;

-- Optional: Add indexes for performance if they don't exist
create index if not exists idx_reviews_listing_id on public.reviews(listing_id);
create index if not exists idx_reviews_operator_id on public.reviews(operator_id);
create index if not exists idx_reviews_user_id on public.reviews(user_id);

-- Optional: Add comments (will fail silently if table/column doesn't exist)
comment on table public.reviews is 'Stores user reviews for listings and operators.';
comment on column public.reviews.listing_id is 'Foreign key to the listing being reviewed (if applicable).';
comment on column public.reviews.operator_id is 'Foreign key to the operator being reviewed (if applicable).';
comment on column public.reviews.rating is 'User rating from 1 to 5.';
comment on column public.reviews.comment is 'User''s textual feedback.';
comment on column public.reviews.used_guide is 'Indicates if a guide was used for the experience being reviewed.';
