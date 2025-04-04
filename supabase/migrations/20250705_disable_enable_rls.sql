-- Temporarily disable Row Level Security for data insertion
-- This should be run by a superuser or service role account

-- Disable RLS on tables
ALTER TABLE points_of_interest DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;

-- After data insertion, re-enable RLS
-- RUN THE COMMANDS BELOW AFTER YOUR DATA HAS BEEN INSERTED:

-- ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE listings ENABLE ROW LEVEL SECURITY; 