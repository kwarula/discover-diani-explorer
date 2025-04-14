-- Add the specialties column to the operators table
ALTER TABLE public.operators
ADD COLUMN specialties text[] NULL; 
-- Using NULL allows existing rows to be valid without a value
-- You might add a default value later if needed, e.g., DEFAULT '{}'::text[]

COMMENT ON COLUMN public.operators.specialties IS 'Array of specialties or operator types the business offers (e.g., Tuk-tuk Driver, Tour Guide)';
