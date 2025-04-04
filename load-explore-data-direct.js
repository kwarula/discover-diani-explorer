#!/usr/bin/env node

/**
 * This script loads data for the Explore page categories: Beaches, Activities, Attractions, and Dining
 * Run with: node load-explore-data-direct.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Initialize environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for environment variables
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables. Check your .env file.');
  console.error('Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key if available, or anon key as fallback
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Read the SQL file
const sqlFilePath = join(__dirname, 'supabase/migrations/20250704_seed_explore_categories.sql');
const sqlContent = readFileSync(sqlFilePath, 'utf8');

async function loadExploreData() {
  console.log('🔧 Starting to load Explore page data...');
  
  try {
    // Check connection
    console.log('🔍 Testing database connection...');
    const { error: connectionError } = await supabase.from('listings').select('count').limit(0);
    
    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError.message);
      if (connectionError.message.includes('auth/invalid_credentials')) {
        console.log('💡 You may need to use a service role key for these operations.');
        console.log('   Add SUPABASE_SERVICE_ROLE_KEY to your .env file.');
      }
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Insert beach POIs data
    console.log('🔄 Inserting Beach POIs data...');
    
    const beachPOIs = [
      {
        name: 'Diani Beach',
        description: 'The main beach stretch of Diani, known for its pristine white sands and crystal-clear turquoise waters. Perfect for swimming, sunbathing, and beach walks.',
        category: 'beach_area',
        latitude: -4.2774,
        longitude: 39.5896,
        images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
        access_notes: 'Public access through various entrances along Beach Road. Some areas may have hotel restrictions.',
        featured: true,
        guide_required: false,
        entrance_fee: 'Free'
      },
      {
        name: 'Galu Beach',
        description: 'A quieter extension of Diani Beach to the south, with fewer hotels and more residential areas. Great for long walks and kitesurfing.',
        category: 'beach_area',
        latitude: -4.3226,
        longitude: 39.5712,
        images: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
        access_notes: 'Multiple public access points, best entered from the main road.',
        featured: true,
        guide_required: false,
        entrance_fee: 'Free'
      },
      {
        name: 'Tiwi Beach',
        description: 'A beautiful beach area north of Diani, less developed and more secluded. Great for those seeking a quieter beach experience.',
        category: 'beach_area',
        latitude: -4.2447,
        longitude: 39.6025,
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'],
        access_notes: 'Access through Tiwi Beach Road, limited public access points.',
        featured: true,
        guide_required: false,
        entrance_fee: 'Free'
      },
      {
        name: 'Chale Island Beach',
        description: 'A small private island with unique beaches featuring white sand mixed with natural coral formations. Accessible via boat from mainland Diani.',
        category: 'beach_area',
        latitude: -4.3166,
        longitude: 39.5333,
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'],
        access_notes: 'Day trips available, or stay at the island\'s resort. Boat transfer required.',
        featured: true,
        guide_required: true,
        entrance_fee: 'Varies based on resort package or day trip fee'
      },
      {
        name: 'Kinondo Beach',
        description: 'A hidden gem located to the south of Galu Beach. Less crowded and more authentic local atmosphere.',
        category: 'beach_area',
        latitude: -4.3366,
        longitude: 39.5608,
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'],
        access_notes: 'Limited access points, best accessed through local guides.',
        featured: false,
        guide_required: false,
        entrance_fee: 'Free'
      }
    ];
    
    const { error: beachError } = await supabase.from('points_of_interest').insert(beachPOIs);
    
    if (beachError) {
      console.error('❌ Error inserting beaches:', beachError.message);
    } else {
      console.log('✅ Beach POIs inserted successfully');
    }
    
    // Insert Activities data
    console.log('🔄 Inserting Activities data...');
    
    const activities = [
      {
        title: 'Diani Reef Snorkeling Tour',
        description: 'Experience the vibrant coral reefs of Diani Beach, home to colorful fish, sea turtles, and fascinating marine life. This guided tour includes all equipment, safety briefing, and marine conservation information.',
        category: 'activity',
        sub_category: 'watersports',
        location: 'Diani Marine Reserve, various departure points along the beach',
        price: 4500,
        price_unit: 'person',
        price_range: '$$',
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
        featured: true,
        is_verified: true,
        guide_recommended: true,
        status: 'approved'
      },
      {
        title: 'Kitesurfing Lessons for Beginners',
        description: 'Learn the thrilling sport of kitesurfing with our professional instructors. Diani is known as one of the best kitesurfing destinations in Africa with consistent winds and perfect conditions for beginners and experts alike.',
        category: 'activity',
        sub_category: 'watersports',
        location: 'Galu Beach (H2O Extreme Kiteschool)',
        price: 8500,
        price_unit: 'lesson',
        price_range: '$$$',
        images: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
        featured: true,
        is_verified: true,
        guide_recommended: true,
        status: 'approved'
      },
      {
        title: 'Sunset Dhow Cruise',
        description: 'Sail on a traditional wooden dhow boat as the sun sets over the Indian Ocean. Enjoy drinks, snacks, and the possibility of dolphin sightings while experiencing local sailing traditions.',
        category: 'activity',
        sub_category: 'relaxation',
        location: 'Departure from various points along Diani Beach',
        price: 6000,
        price_unit: 'person',
        price_range: '$$',
        images: ['https://images.unsplash.com/photo-1590523278191-599c9f67fcb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'],
        featured: true,
        is_verified: true,
        guide_recommended: false,
        status: 'approved'
      },
      {
        title: 'Stand Up Paddleboarding (SUP)',
        description: 'Explore the calm waters of Diani Beach at your own pace with a stand-up paddleboard rental. Great for all skill levels and a peaceful way to enjoy the ocean views.',
        category: 'activity',
        sub_category: 'watersports',
        location: 'Multiple rental locations along Diani Beach',
        price: 1500,
        price_unit: 'hour',
        price_range: '$',
        images: ['https://images.unsplash.com/photo-1531722569936-825d3dd91b15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
        featured: false,
        is_verified: true,
        guide_recommended: false,
        status: 'approved'
      }
    ];
    
    const { error: activitiesError } = await supabase.from('listings').insert(activities);
    
    if (activitiesError) {
      console.error('❌ Error inserting activities:', activitiesError.message);
    } else {
      console.log('✅ Activities inserted successfully');
    }
    
    // Insert Attractions data
    console.log('🔄 Inserting Attractions data...');
    
    const attractions = [
      {
        title: 'Colobus Conservation Centre',
        description: 'Visit this important conservation center working to protect the endangered Angolan colobus monkeys native to Diani. Learn about conservation efforts and see these rare monkeys up close.',
        category: 'attraction',
        sub_category: 'wildlife',
        location: 'Diani Beach Road, near Baobab Shopping Center',
        price: 1000,
        price_unit: 'person',
        price_range: '$',
        images: ['https://images.unsplash.com/photo-1612252715308-963d99374bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
        featured: true,
        is_verified: true,
        guide_recommended: false,
        status: 'approved'
      },
      {
        title: 'Kaya Kinondo Sacred Forest',
        description: 'Experience the cultural and ecological significance of this sacred Mijikenda forest. Guided tours explain the traditional beliefs and the importance of the forest to local communities.',
        category: 'attraction',
        sub_category: 'cultural',
        location: 'Kinondo area, south of Diani',
        price: 1500,
        price_unit: 'person',
        price_range: '$',
        images: ['https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
        featured: true,
        is_verified: true,
        guide_recommended: true,
        status: 'approved'
      },
      {
        title: 'Shimba Hills National Reserve',
        description: 'A day trip to this coastal rainforest reserve offers sightings of elephants, sable antelopes, and diverse bird species. The Sheldrick Falls provides a refreshing swimming spot.',
        category: 'attraction',
        sub_category: 'wildlife',
        location: 'Approximately 33km from Diani Beach',
        price: 12000,
        price_unit: 'person (includes park fees)',
        price_range: '$$$',
        images: ['https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'],
        featured: true,
        is_verified: true,
        guide_recommended: true,
        status: 'approved'
      }
    ];
    
    const { error: attractionsError } = await supabase.from('listings').insert(attractions);
    
    if (attractionsError) {
      console.error('❌ Error inserting attractions:', attractionsError.message);
    } else {
      console.log('✅ Attractions inserted successfully');
    }
    
    // Insert Dining data
    console.log('🔄 Inserting Dining data...');
    
    const dining = [
      {
        title: 'Ali Barbour\'s Cave Restaurant',
        description: 'A unique dining experience set in a natural coral cave believed to be 180,000 years old. Enjoy fine international cuisine under the stars with the cave ceiling open to the night sky.',
        category: 'dining',
        sub_category: 'fine dining',
        location: 'Diani Beach Road, near Baobab Hotel',
        price_range: '$$$',
        images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
        featured: true,
        is_verified: true,
        status: 'approved'
      },
      {
        title: 'Nomad Beach Bar & Restaurant',
        description: 'Beachfront dining with a relaxed atmosphere featuring wood-fired pizzas, fresh seafood, and international cuisine with an African twist. Great for sunset cocktails.',
        category: 'dining',
        sub_category: 'casual dining',
        location: 'The Sands at Nomad, Diani Beach',
        price_range: '$$',
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
        featured: true,
        is_verified: true,
        status: 'approved'
      },
      {
        title: 'Kokkos Café Diani',
        description: 'Popular breakfast and lunch spot known for healthy options, fresh juices, homemade pastries, and great coffee. Has a cozy garden setting.',
        category: 'dining',
        sub_category: 'cafe',
        location: 'Diani Beach Road, near Nakumatt Plaza',
        price_range: '$',
        images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80'],
        featured: false,
        is_verified: true,
        status: 'approved'
      }
    ];
    
    const { error: diningError } = await supabase.from('listings').insert(dining);
    
    if (diningError) {
      console.error('❌ Error inserting dining:', diningError.message);
    } else {
      console.log('✅ Dining options inserted successfully');
    }
    
    // Verify data was inserted
    console.log('🔍 Verifying data was loaded...');
    
    // Check listings with each category
    const categories = ['activity', 'attraction', 'dining'];
    for (const category of categories) {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title')
        .eq('category', category)
        .limit(5);
      
      if (error) {
        console.error(`❌ Error checking ${category} listings:`, error.message);
      } else {
        console.log(`✅ ${category.charAt(0).toUpperCase() + category.slice(1)} listings loaded: ${data.length} items`);
        if (data.length > 0) {
          data.forEach((item, index) => {
            if (index < 3) { // Show up to 3 items
              console.log(`   - ${item.title}`);
            }
          });
        }
      }
    }
    
    // Check beach POIs
    const { data: beaches, error: beachCheckError } = await supabase
      .from('points_of_interest')
      .select('id, name')
      .eq('category', 'beach_area')
      .limit(5);
    
    if (beachCheckError) {
      console.error('❌ Error checking beach POIs:', beachCheckError.message);
    } else {
      console.log(`✅ Beach POIs loaded: ${beaches.length} items`);
      if (beaches.length > 0) {
        beaches.forEach((beach, index) => {
          if (index < 3) { // Show up to 3 items
            console.log(`   - ${beach.name}`);
          }
        });
      }
    }
    
    console.log('✅ Explore page data load complete!');
    console.log('💡 Next steps:');
    console.log('   1. Restart your application');
    console.log('   2. Navigate to the Explore page to see the new data');
    console.log('   3. If you need to modify the data, edit this script and run it again');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

loadExploreData(); 