-- Seed data for Explore page categories: Beaches, Activities, Attractions, and Dining
-- This script creates entries in both listings and points_of_interest tables

-- First, ensure we have the necessary tables
-- Note: These should already exist based on previous migrations

-- Add Beach category items (as POIs)
INSERT INTO points_of_interest (name, description, category, latitude, longitude, images, access_notes, featured, guide_required, entrance_fee)
VALUES
  (
    'Diani Beach',
    'The main beach stretch of Diani, known for its pristine white sands and crystal-clear turquoise waters. Perfect for swimming, sunbathing, and beach walks.',
    'beach_area',
    -4.2774,
    39.5896,
    ARRAY['https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    'Public access through various entrances along Beach Road. Some areas may have hotel restrictions.',
    TRUE,
    FALSE,
    'Free'
  ),
  (
    'Galu Beach',
    'A quieter extension of Diani Beach to the south, with fewer hotels and more residential areas. Great for long walks and kitesurfing.',
    'beach_area',
    -4.3226,
    39.5712,
    ARRAY['https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    'Multiple public access points, best entered from the main road.',
    TRUE,
    FALSE,
    'Free'
  ),
  (
    'Tiwi Beach',
    'A beautiful beach area north of Diani, less developed and more secluded. Great for those seeking a quieter beach experience.',
    'beach_area',
    -4.2447,
    39.6025,
    ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'],
    'Access through Tiwi Beach Road, limited public access points.',
    TRUE,
    FALSE,
    'Free'
  ),
  (
    'Chale Island Beach',
    'A small private island with unique beaches featuring white sand mixed with natural coral formations. Accessible via boat from mainland Diani.',
    'beach_area',
    -4.3166,
    39.5333,
    ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'],
    'Day trips available, or stay at the island''s resort. Boat transfer required.',
    TRUE,
    TRUE,
    'Varies based on resort package or day trip fee'
  ),
  (
    'Kinondo Beach',
    'A hidden gem located to the south of Galu Beach. Less crowded and more authentic local atmosphere.',
    'beach_area',
    -4.3366,
    39.5608,
    ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'],
    'Limited access points, best accessed through local guides.',
    FALSE,
    FALSE,
    'Free'
  );

-- Add Activities
INSERT INTO listings (title, description, category, sub_category, location, price, price_unit, price_range, images, featured, is_verified, guide_recommended, status)
VALUES
  (
    'Diani Reef Snorkeling Tour',
    'Experience the vibrant coral reefs of Diani Beach, home to colorful fish, sea turtles, and fascinating marine life. This guided tour includes all equipment, safety briefing, and marine conservation information.',
    'activity',
    'watersports',
    'Diani Marine Reserve, various departure points along the beach',
    4500,
    'person',
    '$$',
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    TRUE,
    TRUE,
    TRUE,
    'approved'
  ),
  (
    'Kitesurfing Lessons for Beginners',
    'Learn the thrilling sport of kitesurfing with our professional instructors. Diani is known as one of the best kitesurfing destinations in Africa with consistent winds and perfect conditions for beginners and experts alike.',
    'activity',
    'watersports',
    'Galu Beach (H2O Extreme Kiteschool)',
    8500,
    'lesson',
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
    TRUE,
    TRUE,
    TRUE,
    'approved'
  ),
  (
    'Sunset Dhow Cruise',
    'Sail on a traditional wooden dhow boat as the sun sets over the Indian Ocean. Enjoy drinks, snacks, and the possibility of dolphin sightings while experiencing local sailing traditions.',
    'activity',
    'relaxation',
    'Departure from various points along Diani Beach',
    6000,
    'person',
    '$$',
    ARRAY['https://images.unsplash.com/photo-1590523278191-599c9f67fcb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'],
    TRUE,
    TRUE,
    FALSE,
    'approved'
  ),
  (
    'Stand Up Paddleboarding (SUP)',
    'Explore the calm waters of Diani Beach at your own pace with a stand-up paddleboard rental. Great for all skill levels and a peaceful way to enjoy the ocean views.',
    'activity',
    'watersports',
    'Multiple rental locations along Diani Beach',
    1500,
    'hour',
    '$',
    ARRAY['https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
    FALSE,
    TRUE,
    FALSE,
    'approved'
  ),
  (
    'Scuba Diving Certification Course',
    'Get PADI certified with our comprehensive scuba diving course. Diani''s warm waters and abundant marine life make it an ideal place to learn diving.',
    'activity',
    'watersports',
    'Dive Centers along Diani Beach',
    35000,
    'course',
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    FALSE,
    TRUE,
    TRUE,
    'approved'
  );

-- Add Attractions
INSERT INTO listings (title, description, category, sub_category, location, price, price_unit, price_range, images, featured, is_verified, guide_recommended, status)
VALUES
  (
    'Colobus Conservation Centre',
    'Visit this important conservation center working to protect the endangered Angolan colobus monkeys native to Diani. Learn about conservation efforts and see these rare monkeys up close.',
    'attraction',
    'wildlife',
    'Diani Beach Road, near Baobab Shopping Center',
    1000,
    'person',
    '$',
    ARRAY['https://images.unsplash.com/photo-1612252715308-963d99374bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    TRUE,
    TRUE,
    FALSE,
    'approved'
  ),
  (
    'Kaya Kinondo Sacred Forest',
    'Experience the cultural and ecological significance of this sacred Mijikenda forest. Guided tours explain the traditional beliefs and the importance of the forest to local communities.',
    'attraction',
    'cultural',
    'Kinondo area, south of Diani',
    1500,
    'person',
    '$',
    ARRAY['https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    TRUE,
    TRUE,
    TRUE,
    'approved'
  ),
  (
    'Shimba Hills National Reserve',
    'A day trip to this coastal rainforest reserve offers sightings of elephants, sable antelopes, and diverse bird species. The Sheldrick Falls provides a refreshing swimming spot.',
    'attraction',
    'wildlife',
    'Approximately 33km from Diani Beach',
    12000,
    'person (includes park fees)',
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
    TRUE,
    TRUE,
    TRUE,
    'approved'
  ),
  (
    'Diani Beach Art Gallery',
    'Explore local and international art inspired by the coastal landscape and culture of Kenya. The gallery features rotating exhibitions and often hosts cultural events.',
    'attraction',
    'culture',
    'Diani Beach Road',
    500,
    'person',
    '$',
    ARRAY['https://images.unsplash.com/photo-1594766174627-2b8d07ae4f4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    FALSE,
    TRUE,
    FALSE,
    'approved'
  );

-- Add Dining options
INSERT INTO listings (title, description, category, sub_category, location, price_range, images, featured, is_verified, status)
VALUES
  (
    'Ali Barbour''s Cave Restaurant',
    'A unique dining experience set in a natural coral cave believed to be 180,000 years old. Enjoy fine international cuisine under the stars with the cave ceiling open to the night sky.',
    'dining',
    'fine dining',
    'Diani Beach Road, near Baobab Hotel',
    '$$$',
    ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    TRUE,
    TRUE,
    'approved'
  ),
  (
    'Nomad Beach Bar & Restaurant',
    'Beachfront dining with a relaxed atmosphere featuring wood-fired pizzas, fresh seafood, and international cuisine with an African twist. Great for sunset cocktails.',
    'dining',
    'casual dining',
    'The Sands at Nomad, Diani Beach',
    '$$',
    ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    TRUE,
    TRUE,
    'approved'
  ),
  (
    'Sails Beach Bar & Restaurant',
    'Enjoy fresh seafood and international cuisine right on the beach with views of the Indian Ocean. Known for its relaxed atmosphere and toes-in-the-sand dining experience.',
    'dining',
    'casual dining',
    'Central Diani Beach, near Kenyaways',
    '$$',
    ARRAY['https://images.unsplash.com/photo-1554295405-abb8fd54f153?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80'],
    TRUE,
    TRUE,
    'approved'
  ),
  (
    'Kokkos Café Diani',
    'Popular breakfast and lunch spot known for healthy options, fresh juices, homemade pastries, and great coffee. Has a cozy garden setting.',
    'dining',
    'cafe',
    'Diani Beach Road, near Nakumatt Plaza',
    '$',
    ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80'],
    FALSE,
    TRUE,
    'approved'
  ),
  (
    'Piri Piries African & Mediterranean Restaurant',
    'Family-run restaurant offering a blend of African and Mediterranean cuisines featuring fresh local ingredients. Known for generous portions and authentic flavors.',
    'dining',
    'casual dining',
    'Diani Beach Road, Ukunda',
    '$$',
    ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
    FALSE,
    TRUE,
    'approved'
  ); 