-- Enable RLS on operators table
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert their own operator profile
CREATE POLICY "Users can create their own operator profile"
ON operators
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own operator profile
CREATE POLICY "Users can view their own operator profile"
ON operators
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy to allow users to update their own operator profile
CREATE POLICY "Users can update their own operator profile"
ON operators
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own operator profile
CREATE POLICY "Users can delete their own operator profile"
ON operators
FOR DELETE
TO authenticated
USING (auth.uid() = user_id); 