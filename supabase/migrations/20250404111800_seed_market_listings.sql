-- Sample data for listings table

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
DECLARE
  seed_user_id uuid;
BEGIN
  -- Attempt to get the ID of the first user found in auth.users
  -- This assumes at least one user exists. Adjust if needed (e.g., specific email).
  SELECT id INTO seed_user_id FROM auth.users LIMIT 1;

  -- Check if a user ID was found
  IF seed_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found in auth.users table to assign seed listings to.';
  END IF;

  -- Real Estate (Category: property)
  INSERT INTO public.listings (title, description, price, price_unit, category, sub_category, location, images, status, featured, user_id) VALUES 
  ('Modern Beachfront Apartment', 'Stunning 2-bedroom apartment with direct beach access and ocean views. Fully furnished, shared pool.', 2800, 'USD / month', 'property', 'Rent', 'Central Diani Beach', ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'], 'active', true, seed_user_id),
  ('Spacious Villa near Ukunda Airstrip', '4-bedroom villa with private garden and pool, close to amenities and the airstrip. Ideal for families.', 650000, 'USD', 'property', 'Sale', 'Ukunda Area', ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'], 'active', false, seed_user_id);

  -- Products (Category: products)
  INSERT INTO public.listings (title, description, price, price_unit, category, sub_category, location, images, status, featured, user_id) VALUES 
  ('Hand-carved Wooden Giraffe', 'Beautifully crafted wooden giraffe sculpture by local Diani artisan. Medium size (approx 50cm).', 45, 'USD', 'products', 'Handcrafts', 'Diani Beach Road Shops', ARRAY['https://images.unsplash.com/photo-1630694093867-4b947d812bf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'], 'active', true, seed_user_id),
  ('Fresh Organic Mangoes (Box)', 'A box of delicious, locally grown organic mangoes, straight from the farm.', 15, 'USD', 'products', 'Food & Wellness', 'Diani Farmers Market', ARRAY['https://images.unsplash.com/photo-1591073113125-e46713c82959?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'], 'active', false, seed_user_id);

  -- Services (Category: services)
  INSERT INTO public.listings (title, description, price, price_unit, category, sub_category, location, images, status, featured, user_id) VALUES 
  ('Kitesurfing Lessons (Beginner)', '2-hour introductory kitesurfing lesson with certified instructor. Equipment included.', 90, 'USD / person', 'services', 'Watersports', 'Galu Beach', ARRAY['https://images.unsplash.com/photo-1599047649240-637a641246f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'], 'active', true, seed_user_id),
  ('Guided Tour to Shimba Hills', 'Full-day guided tour to Shimba Hills National Reserve. Includes transport, park fees, and lunch.', 150, 'USD / person', 'services', 'Tours & Excursions', 'Pickup from Diani hotels', ARRAY['https://images.unsplash.com/photo-1604917621950-9a7765609160?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'], 'active', false, seed_user_id);

  -- Transport (Category: transport)
  INSERT INTO public.listings (title, description, price, price_unit, category, sub_category, location, images, status, featured, user_id) VALUES 
  ('Airport Transfer (Moi Int. MBA)', 'Private taxi transfer from Mombasa Moi International Airport (MBA) to Diani Beach hotels.', 50, 'USD / vehicle', 'transport', 'Airport Transfer', 'Mombasa Airport / Diani', ARRAY['https://images.unsplash.com/photo-1533674689012-7b3b0a43a759?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'], 'active', true, seed_user_id),
  ('Car Hire (Self-Drive SUV)', 'Rent a reliable SUV for self-drive exploration around Diani and the South Coast. Daily rate.', 75, 'USD / day', 'transport', 'Vehicle Rental', 'Diani Beach Road', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'], 'active', false, seed_user_id);

END $$;
