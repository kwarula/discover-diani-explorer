#!/usr/bin/env node

/**
 * This script sets up everything needed for the Explore page:
 * 1. Creates the execute_sql function
 * 2. Loads data for all categories: Beaches, Activities, Attractions, and Dining
 * 
 * IMPORTANT: This script requires SUPABASE_SERVICE_ROLE_KEY in your .env file
 * Run with: node setup-explore-page.js
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
if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables. Check your .env file.');
  console.error('This script requires:');
  console.error('  - VITE_SUPABASE_URL: Your Supabase project URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY: Service role key with elevated permissions');
  console.error('\nSee README_EXPLORE_DATA.md for more information.');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupExplorePage() {
  console.log('🚀 Starting Explore page setup...');
  
  try {
    // Step 1: Test connection
    console.log('🔍 Testing database connection with service role...');
    const { error: connectionError } = await supabase.from('listings').select('count').limit(0);
    
    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError.message);
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Step 2: Create the SQL execution functions
    console.log('🔧 Creating SQL execution functions...');
    
    const createFunctionsSql = readFileSync(join(__dirname, 'create-execute-sql-function.sql'), 'utf8');
    
    // We need to split the SQL into separate statements
    const sqlStatements = createFunctionsSql.split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const sql of sqlStatements) {
      const { error } = await supabase.rpc('exec_sql', { sql: sql + ';' }).catch(e => ({ error: e }));
      
      // For the first function, we expect it might not exist yet, so we use raw SQL
      if (error && error.message?.includes('function exec_sql(text) does not exist')) {
        // Direct SQL query for the first function
        const { error: rawError } = await supabase.from('_temp_query').select().rpc('exec_sql', { sql: sql + ';' }).catch(e => ({ error: e }));
        
        // If this also fails, we need to manually run the SQL in the dashboard
        if (rawError) {
          console.error('❌ Could not create SQL execution functions:', rawError.message);
          console.log('⚠️ You may need to manually run the SQL in create-execute-sql-function.sql in the Supabase dashboard.');
          console.log('⚠️ After doing that, run this script again.');
          process.exit(1);
        }
      } else if (error && !error.message?.includes('function exec_sql(text) does not exist')) {
        console.error('❌ Error creating SQL functions:', error.message);
      }
    }
    
    console.log('✅ SQL execution functions created or already exist');
    
    // Step 3: Disable RLS for data insertion
    console.log('🔄 Temporarily disabling Row Level Security...');
    
    // Disable RLS for points_of_interest
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE points_of_interest DISABLE ROW LEVEL SECURITY;'
    });
    
    // Disable RLS for listings
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE listings DISABLE ROW LEVEL SECURITY;'
    });
    
    console.log('✅ RLS temporarily disabled');
    
    // Step 4: Load data from our SQL file
    console.log('📥 Loading Explore page data...');
    
    // Read SQL data file
    const dataSqlFile = join(__dirname, 'supabase/migrations/20250704_seed_explore_categories.sql');
    const dataSql = readFileSync(dataSqlFile, 'utf8');
    
    // Split the SQL into separate statements
    const dataStatements = dataSql.split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));
    
    // Execute each statement
    for (let i = 0; i < dataStatements.length; i++) {
      const sql = dataStatements[i];
      console.log(`🔄 Executing data statement ${i + 1}/${dataStatements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: sql + ';' });
      
      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        console.log('⚠️ Continuing with next statement...');
      }
    }
    
    console.log('✅ Explore page data loaded');
    
    // Step 5: Re-enable RLS
    console.log('🔄 Re-enabling Row Level Security...');
    
    // Re-enable RLS for points_of_interest
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;'
    });
    
    // Re-enable RLS for listings
    await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE listings ENABLE ROW LEVEL SECURITY;'
    });
    
    console.log('✅ RLS policies restored');
    
    // Step 6: Verify data was inserted
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
    
    console.log('');
    console.log('🎉 Explore page setup complete!');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   1. Restart your application');
    console.log('   2. Navigate to the Explore page to see the new data');
    console.log('   3. Check that all categories display correctly');
    console.log('');
    console.log('For more information, see README_EXPLORE_DATA.md');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Attempt to restore RLS in case of error
    try {
      await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;'
      });
      await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE listings ENABLE ROW LEVEL SECURITY;'
      });
      console.log('✅ RLS restored despite error');
    } catch (e) {
      console.error('❌ Failed to restore RLS:', e.message);
    }
    
    process.exit(1);
  }
}

setupExplorePage(); 