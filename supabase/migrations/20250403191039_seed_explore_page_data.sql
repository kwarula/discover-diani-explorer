-- Seed data for listings table (Explore Page categories)

-- Ensure status is 'approved' to show up in default queries
-- Use default values for fields not specified (like user_id, created_at, updated_at)

INSERT INTO public.listings (title, description, category, sub_category, location, price, price_unit, price_range, images, featured, is_verified, guide_recommended, tide_dependency, status) VALUES
(
    'Diani Reef Snorkeling Tour',
    'Explore vibrant coral reefs and diverse marine life in the crystal clear waters of Diani Beach. Includes gear and guide.',
    'activity', -- Main category
    'watersports', -- Sub-category
    'Diani Marine Reserve',
    4500, -- Price in KES (example)
    'person', -- Price unit
    '$$', -- Price range indicator
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    true, -- Featured
    true, -- Is verified
    true, -- Guide recommended
    'low_tide_best', -- Tide dependency
    'approved' -- Status
),
(
    'Kitesurfing Lesson (Beginner)',
    'Learn the basics of kitesurfing with professional instructors in one of Africa''s best kitesurfing spots.',
    'activity',
    'watersports',
    'Galu Beach',
    8500,
    'lesson',
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
    false,
    true,
    true,
    null, -- No specific tide dependency
    'approved'
),
(
    'Sunset Dhow Cruise',
    'Sail on a traditional wooden dhow as the sun sets over the Indian Ocean. Includes refreshments and snacks.',
    'activity',
    'relaxation',
    'Diani Beach (various operators)',
    6000,
    'person',
    '$$',
    ARRAY['https://images.unsplash.com/photo-1590523278191-599c9f67fcb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'],
    true,
    false, -- Example: Not verified
    false,
    null,
    'approved'
),
(
    'Glass Bottom Boat Tour',
    'View the underwater world without getting wet on these popular family-friendly tours over the reef.',
    'activity',
    'family',
    'Central Diani Beach',
    2500,
    'person',
    '$',
    ARRAY['https://images.unsplash.com/photo-1561738687-52807c030c55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80'],
    false,
    true,
    false,
    'low_tide_best',
    'approved'
),
(
    'Shimba Hills Day Trip',
    'Full-day excursion to Shimba Hills National Reserve to see elephants, Sable antelope, waterfalls, and coastal rainforest.',
    'activity',
    'wildlife',
    'Shimba Hills National Reserve',
    12000,
    'person (incl. park fees)',
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
    false,
    true,
    true, -- Guide is essential for park drives
    null,
    'approved'
),
(
    'Stand Up Paddleboarding (SUP) Rental',
    'Rent a paddleboard and explore the calm lagoon waters at your own pace.',
    'activity',
    'watersports',
    'Galu Beach / Central Diani',
    1500,
    'hour',
    '$',
    ARRAY['https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
    false,
    false,
    false,
    null,
    'approved'
),
(
    'Sails Beach Bar & Restaurant',
    'Beachfront dining with fresh seafood and international cuisine. Perfect for sunset cocktails.',
    'dining',
    'seafood',
    'Central Diani Beach',
    null, -- Price might not be applicable directly
    null,
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
    true,
    true,
    false,
    null,
    'approved'
),
(
    'Ali Barbour''s Cave Restaurant',
    'Unique dining experience in a natural coral cave, serving gourmet cuisine under the stars.',
    'dining',
    'fine dining',
    'Diani Beach Road',
    null,
    null,
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'], -- Placeholder image
    true,
    true,
    false,
    null,
    'approved'
),
(
    'Nomad Beach Bar & Restaurant',
    'Casual beachfront dining with wood-fired pizzas, seafood, and relaxed atmosphere.',
    'dining',
    'casual dining',
    'South Diani (The Sands at Nomad)',
    null,
    null,
    '$$',
    ARRAY['https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'], -- Placeholder image
    false,
    true,
    false,
    null,
    'approved'
),
(
    'Leopard Beach Resort & Spa',
    'Luxury resort offering stunning ocean views, multiple pools, restaurants, and spa facilities.',
    'accommodation',
    'resort',
    'Diani Beach Road',
    35000, -- Example price per night
    'night',
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'], -- Placeholder image
    true,
    true,
    false,
    null,
    'approved'
),
(
    'Diani Backpackers Hostel',
    'Affordable and social hostel accommodation perfect for budget travelers and meeting new people.',
    'accommodation',
    'hostel',
    'Near Ukunda Town',
    2200,
    'night',
    '$',
    ARRAY['https://images.unsplash.com/photo-1586979879734-976b4838a14a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'], -- Placeholder image
    false,
    false,
    false,
    null,
    'approved'
);


-- Seed data for points_of_interest table
-- Using approximate coordinates and sample data

INSERT INTO public.points_of_interest (name, description, category, latitude, longitude, history, access_notes, guide_required, image_urls) VALUES
(
    'Kongo Mosque Ruins',
    'Historic ruins of one of the oldest mosques on the Kenyan coast, located near the Kongo River estuary.',
    'Historical Site',
    -4.325, -- Approximate Latitude
    39.558, -- Approximate Longitude
    'Believed to date back to the 14th or 15th century, showcasing early Swahili architecture.',
    'Usually open access, sometimes local guides offer tours for a small fee. Best visited during the day.',
    false, -- Guide not strictly required but can enhance experience
    ARRAY['https://images.unsplash.com/photo-1604880920163-1a85a64a4fd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'] -- Placeholder image
),
(
    'Colobus Conservation Center',
    'A non-profit organization dedicated to the conservation of the Angolan Colobus monkey and its coastal forest habitat.',
    'Wildlife Sanctuary',
    -4.2700, -- Approximate Latitude
    39.5800, -- Approximate Longitude
    'Established to protect the endangered Colobus monkeys found in the Diani area. Offers guided walks and educational programs.',
    'Entrance fee applies, supports conservation efforts. Guided tours available.',
    true, -- Guided tour is the primary way to visit
    ARRAY['https://images.unsplash.com/photo-1594128597047-ab2801b1e6bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80']
),
(
    'Africa Pool (at low tide)',
    'A natural depression in the reef that forms a large pool resembling the map of Africa during low tide.',
    'Natural Landmark',
    -4.300, -- Very Approximate Latitude (near The Sands at Nomad)
    39.575, -- Very Approximate Longitude
    'A fascinating natural formation visible only during low spring tides.',
    'Accessible by walking on the reef at low tide. Check tide times carefully. Wear reef shoes.',
    false,
    ARRAY['https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'] -- Placeholder image
),
(
    'Shimba Hills National Reserve Viewpoint',
    'Offers panoramic views of the Shimba Hills reserve and, on clear days, the Indian Ocean.',
    'Viewpoint',
    -4.245, -- Approximate Latitude within Shimba Hills
    39.425, -- Approximate Longitude within Shimba Hills
    'Part of the Shimba Hills National Reserve, known for its coastal rainforest, elephants, and Sable antelope.',
    'Accessible via park entrance (fees apply). Requires transport (4x4 recommended).',
    false, -- Guide not required for viewpoint but recommended for park drives
    ARRAY['https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'] -- Placeholder image
);
