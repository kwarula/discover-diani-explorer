-- Create a function that allows executing arbitrary SQL
-- This will be used by the data loading scripts
-- IMPORTANT: This function should only be called with a service role key, never from client-side code

-- Drop the function if it already exists (to recreate it)
DROP FUNCTION IF EXISTS execute_sql(sql text);

-- Create the function
CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Rename for compatibility with our script
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$; 