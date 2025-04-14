-- Create a function to execute SQL statements with administrative privileges
-- This function is needed for our database repair scripts
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Grant execute privilege to service role and authenticated users
GRANT EXECUTE ON FUNCTION exec_sql TO service_role;

-- Add comment to document the function
COMMENT ON FUNCTION exec_sql IS 'Function to execute SQL statements with administrative privileges. Use with caution!'; 