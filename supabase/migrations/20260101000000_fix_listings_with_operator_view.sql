-- Fix the security definer issue on the listings_with_operator view
-- The current view has SECURITY DEFINER which is considered a security issue
-- This migration drops the current view and recreates it without SECURITY DEFINER

-- First drop the existing view
DROP VIEW IF EXISTS public.listings_with_operator;

-- Recreate the view without SECURITY DEFINER
-- The view joins listings with operators to show listing details and operator names
CREATE VIEW public.listings_with_operator AS
SELECT 
  l.id,
  l.title,
  l.description,
  l.category,
  l.sub_category,
  l.location,
  l.price,
  l.price_unit,
  l.price_range,
  l.images,
  l.status,
  l.featured,
  l.user_id,
  l.created_at,
  l.updated_at,
  l.is_verified,
  l.tide_dependency,
  l.guide_recommended,
  l.wildlife_notice,
  l.transport_instructions,
  -- Include operator name from the operators table if available
  o.business_name as operator_name
FROM 
  public.listings l
LEFT JOIN 
  public.operators o ON l.user_id = o.user_id;

-- Add appropriate comment explaining the view's purpose
COMMENT ON VIEW public.listings_with_operator IS 'Joins listings with operators to display operator information alongside listing details'; 