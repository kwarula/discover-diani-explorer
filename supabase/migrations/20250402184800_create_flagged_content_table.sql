-- Migration script to create the flagged_content table

-- Define an enum for content types (optional but recommended for consistency)
CREATE TYPE public.flagged_content_type AS ENUM (
    'Review',
    'Comment',
    'Listing',
    'OperatorProfile' -- Added OperatorProfile as another possibility
    -- Add other types as needed
);

-- Define an enum for moderation status
CREATE TYPE public.moderation_status AS ENUM (
    'Pending',
    'Resolved',
    'Dismissed' -- Added Dismissed as another possibility
);

-- Create the flagged_content table
CREATE TABLE public.flagged_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id text NOT NULL, -- ID of the flagged content (can be uuid or other text ID)
    content_type public.flagged_content_type NOT NULL, -- Type of content flagged
    content_snippet text, -- A short snippet of the flagged content
    reason text, -- Reason provided by the reporter
    reported_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to the reporting user (optional)
    status public.moderation_status NOT NULL DEFAULT 'Pending', -- Moderation status
    reported_at timestamp with time zone NOT NULL DEFAULT now(),
    resolved_at timestamp with time zone, -- When the moderation action was taken
    resolved_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Admin who resolved it (optional)
    moderator_notes text -- Optional notes from the admin
);

-- Add indexes for faster querying
CREATE INDEX idx_flagged_content_status ON public.flagged_content(status);
CREATE INDEX idx_flagged_content_type ON public.flagged_content(content_type);
CREATE INDEX idx_flagged_content_reported_at ON public.flagged_content(reported_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.flagged_content ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Allow authenticated users to insert flags
CREATE POLICY "Allow authenticated users to insert flags"
ON public.flagged_content
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow admins (or specific roles) to read all flags
-- TODO: Define an 'admin' role or use a custom claim check
CREATE POLICY "Allow admins to read all flags"
ON public.flagged_content
FOR SELECT
-- TO authenticated -- Adjust role/claim as needed
USING (true); -- Example: Allow any authenticated user for now, refine later

-- Allow admins (or specific roles) to update flag status/notes
-- TODO: Define an 'admin' role or use a custom claim check
CREATE POLICY "Allow admins to update flags"
ON public.flagged_content
FOR UPDATE
-- TO authenticated -- Adjust role/claim as needed
USING (true)
WITH CHECK (true);

-- Allow admins (or specific roles) to delete flags (optional, maybe prefer updating status)
-- CREATE POLICY "Allow admins to delete flags"
-- ON public.flagged_content
-- FOR DELETE
-- TO authenticated -- Adjust role/claim as needed
-- USING (true);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.flagged_content IS 'Stores reports of potentially inappropriate content submitted by users.';
COMMENT ON COLUMN public.flagged_content.content_id IS 'Identifier of the specific review, comment, listing, etc., that was flagged.';
COMMENT ON COLUMN public.flagged_content.content_type IS 'The type of content that was flagged (e.g., Review, Comment).';
COMMENT ON COLUMN public.flagged_content.reported_by_user_id IS 'The user who submitted the flag report.';
COMMENT ON COLUMN public.flagged_content.status IS 'Current moderation status of the flag (Pending, Resolved, Dismissed).';
COMMENT ON COLUMN public.flagged_content.resolved_by_user_id IS 'The administrator who took action on this flag.';
COMMENT ON COLUMN public.flagged_content.moderator_notes IS 'Internal notes left by the moderator regarding the action taken.';
