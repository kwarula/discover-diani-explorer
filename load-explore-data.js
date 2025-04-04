#!/usr/bin/env node

/**
 * This script loads data for the Explore page categories: Beaches, Activities, Attractions, and Dining
 * Run with: node load-explore-data.js
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
const sqlCommands = readFileSync(sqlFilePath, 'utf8');

// Split commands by semicolon to execute them one by one
const commands = sqlCommands
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0);

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
    
    // Execute each command sequentially
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`🔄 Executing command ${i + 1}/${commands.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: command });
      
      if (error) {
        console.error(`❌ Error executing command #${i + 1}:`, error.message);
        console.error('Command was:', command);
        // Continue with other commands despite errors
        console.log('⚠️ Continuing with next command...');
      } else {
        console.log(`✅ Command ${i + 1} executed successfully`);
      }
    }
    
    // Verify data was inserted
    console.log('🔍 Verifying data was loaded...');
    
    // Check listings with each category
    const categories = ['beach', 'activity', 'attraction', 'dining'];
    for (const category of categories) {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title')
        .eq('category', category)
        .limit(3);
      
      if (error) {
        console.error(`❌ Error checking ${category} listings:`, error.message);
      } else {
        console.log(`✅ ${category.charAt(0).toUpperCase() + category.slice(1)} listings loaded: ${data.length} items`);
        if (data.length > 0) {
          console.log(`   First item: ${data[0].title}`);
        }
      }
    }
    
    // Check beach POIs
    const { data: beaches, error: beachError } = await supabase
      .from('points_of_interest')
      .select('id, name')
      .eq('category', 'beach_area')
      .limit(3);
    
    if (beachError) {
      console.error('❌ Error checking beach POIs:', beachError.message);
    } else {
      console.log(`✅ Beach POIs loaded: ${beaches.length} items`);
      if (beaches.length > 0) {
        console.log(`   First beach: ${beaches[0].name}`);
      }
    }
    
    console.log('✅ Explore page data load complete!');
    console.log('💡 Next steps:');
    console.log('   1. Restart your application');
    console.log('   2. Navigate to the Explore page to see the new data');
    console.log('   3. If you need to modify the data, edit the SQL file and run this script again');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

loadExploreData(); 