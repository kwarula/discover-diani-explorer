-- Function to get points of interest open at a specific time and matching tags
create or replace function public.get_relevant_pois(current_time_input time, required_tags text[] default null)
returns setof public.points_of_interest
language sql
stable -- Indicates the function cannot modify the database and always returns the same results for the same arguments within a single transaction
as $$
select *
from public.points_of_interest poi
where
  -- Check opening/closing times
  (
    (poi.opening_time is null and poi.closing_time is null) -- Always open or not applicable (e.g., beaches, viewpoints)
    or
    -- Standard same-day hours check
    (poi.opening_time is not null and poi.closing_time is not null and poi.opening_time <= poi.closing_time and current_time_input >= poi.opening_time and current_time_input < poi.closing_time)
    or
    -- Overnight hours check (e.g., opens 18:00, closes 02:00)
    (poi.opening_time is not null and poi.closing_time is not null and poi.opening_time > poi.closing_time and (current_time_input >= poi.opening_time or current_time_input < poi.closing_time))
    or
    -- Handles cases where only one time is specified (adjust logic based on specific business needs)
    (poi.opening_time is not null and poi.closing_time is null and current_time_input >= poi.opening_time) -- Opens but doesn't close (e.g., bar opens at 6 PM)
    or
    (poi.opening_time is null and poi.closing_time is not null and current_time_input < poi.closing_time) -- No specific open time but closes (less common)
  )
  -- Check tags if provided (using array containment operator)
  and
  (
    required_tags is null -- No tag filter applied
    or
    poi.activity_tags @> required_tags -- Check if POI tags contain all required tags
  );
$$;

comment on function public.get_relevant_pois(time, text[]) is 'Returns points_of_interest that are likely open at the specified current_time_input (assumed EAT/UTC+3) and contain all the required_tags (if provided). Handles same-day and overnight opening hours.';

-- Grant execute permission to the authenticated role (and potentially anon if needed)
grant execute on function public.get_relevant_pois(time, text[]) to authenticated;
grant execute on function public.get_relevant_pois(time, text[]) to service_role;
-- grant execute on function public.get_relevant_pois(time, text[]) to anon; -- Uncomment if anonymous users need to call this
