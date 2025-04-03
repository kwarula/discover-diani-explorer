-- Add the dietary_preferences column to the profiles table
-- Use text[] to store an array of strings
alter table public.profiles
add column dietary_preferences text[] null;

-- Note: No need to update RLS policies specifically for this column,
-- as the existing policies for select/update on the 'profiles' table
-- will implicitly cover this new column.
