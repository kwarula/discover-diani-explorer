-- Enable RLS for the profiles bucket if not already enabled
-- Note: This might already be done, but including it ensures RLS is active.
-- You might need to check your Supabase dashboard -> Storage -> Policies -> profiles bucket
-- ALTER BUCKET profiles ENABLE ROW LEVEL SECURITY; -- Uncomment if needed after checking dashboard

-- Drop existing policies if they conflict (use specific names if known)
-- Example: DROP POLICY IF EXISTS "policy_name" ON storage.objects;

-- Create policy "Allow authenticated users to upload their own avatars"
-- This policy allows users to insert objects into the 'profiles' bucket
-- if the object name starts with 'avatars/' and the first part of the filename
-- (split by '-') matches the authenticated user's ID.
CREATE POLICY "Allow authenticated avatar uploads 1p1h6t" -- Added unique ID to name
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' AND
  auth.role() = 'authenticated' AND -- Ensure the user is authenticated
  -- Extract the 36-character UUID starting after 'avatars/' (position 9)
  auth.uid() = substring(name from 9 for 36)::uuid AND 
  name LIKE 'avatars/%' -- Ensure the file is in the avatars folder
);

-- Optional: Add policy for SELECT (Public Read Access)
-- This allows anyone to view files in the 'avatars/' directory.
-- Adjust or remove if you need stricter read access control.
CREATE POLICY "Allow public read access to avatars 1p1h6t" -- Added unique ID to name
ON storage.objects FOR SELECT
USING (
    bucket_id = 'profiles' AND
    name LIKE 'avatars/%'
);

-- Optional: Add policy for UPDATE (Owner Update Access)
-- Allows the owner to update (overwrite) their own avatar.
CREATE POLICY "Allow owner update access to avatars 1p1h6t" -- Added unique ID to name
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'profiles' AND
    auth.role() = 'authenticated' AND
    -- Extract the 36-character UUID starting after 'avatars/' (position 9)
    auth.uid() = substring(name from 9 for 36)::uuid AND
    name LIKE 'avatars/%'
) WITH CHECK (
    bucket_id = 'profiles' AND
    auth.role() = 'authenticated' AND
    -- Extract the 36-character UUID starting after 'avatars/' (position 9)
    auth.uid() = substring(name from 9 for 36)::uuid AND
    name LIKE 'avatars/%'
);


-- Optional: Add policy for DELETE (Owner Delete Access)
-- Allows the owner to delete their own avatar.
CREATE POLICY "Allow owner delete access to avatars 1p1h6t" -- Added unique ID to name
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'profiles' AND
    auth.role() = 'authenticated' AND
    -- Extract the 36-character UUID starting after 'avatars/' (position 9)
    auth.uid() = substring(name from 9 for 36)::uuid AND
    name LIKE 'avatars/%'
);
