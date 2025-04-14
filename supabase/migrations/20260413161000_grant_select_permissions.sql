-- Grant SELECT permissions on necessary tables to the authenticated role

GRANT SELECT ON TABLE public.listings TO authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.reviews TO authenticated;

COMMENT ON TABLE public.listings IS 'Granting SELECT on listings to authenticated role';
COMMENT ON TABLE public.profiles IS 'Granting SELECT on profiles to authenticated role';
COMMENT ON TABLE public.reviews IS 'Granting SELECT on reviews to authenticated role';
