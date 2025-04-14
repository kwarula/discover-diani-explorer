#!/usr/bin/env node

/**
 * Simple script to check if the current user has a valid profile
 * Run with: node check-profile.js YOUR_USER_ID
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Initialize environment variables
config();

// Check for environment variables
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables. Check your .env file.');
  process.exit(1);
}

// Get user ID from command line arguments
const userId = process.argv[2];
if (!userId) {
  console.error('❌ Please provide a user ID as an argument.');
  console.error('   Usage: node check-profile.js YOUR_USER_ID');
  process.exit(1);
}

console.log(`🔍 Checking profile for user ID: ${userId}`);

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkProfile() {
  try {
    // Check if a profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.error('❌ No profile found for this user ID.');
        console.log('⚠️ The application may be stuck because your profile is missing.');
        
        // Check table structure first
        await checkTableStructure();
        
        console.log('💡 Would you like to create a profile? Type:');
        console.log('   createProfile()');
      } else {
        console.error('❌ Error fetching profile:', profileError.message);
      }
    } else if (profileData) {
      console.log('✅ Profile found:');
      console.log(JSON.stringify(profileData, null, 2));
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

async function checkTableStructure() {
  console.log('🔍 Checking profiles table structure...');
  
  try {
    // Get a sample profile to see columns
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error checking table structure:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('✅ Table exists with columns:');
      console.log(columns.join(', '));
      
      // Check for required columns
      const requiredColumns = ['id', 'role', 'status', 'full_name'];
      const missingColumns = requiredColumns.filter(col => !columns.includes(col));
      
      if (missingColumns.length > 0) {
        console.error('❌ Missing required columns:', missingColumns.join(', '));
        console.log('⚠️ This is likely causing your login issues.');
        console.log('💡 You need to run the SQL in src/utils/createDatabaseStructure.sql in the Supabase SQL Editor.');
      } else {
        console.log('✅ All required columns present');
      }
    } else {
      console.log('ℹ️ No existing profiles found, cannot check structure');
      
      // Try a direct table structure query
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_columns', { table_name: 'profiles' })
        .select('*');
      
      if (tableError) {
        console.error('❌ Cannot check table structure:', tableError.message);
      } else if (tableInfo && tableInfo.length > 0) {
        console.log('✅ Table structure from schema:');
        console.log(tableInfo.map(col => col.column_name).join(', '));
      } else {
        console.error('❌ Profiles table might not exist or is empty');
        console.log('💡 You need to run the SQL in src/utils/createDatabaseStructure.sql in the Supabase SQL Editor.');
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

async function createProfile() {
  console.log('🔧 Creating profile...');
  
  const profileData = {
    id: userId,
    full_name: 'New User',
    username: null,
    avatar_url: null, 
    bio: null,
    is_tourist: true,
    dietary_preferences: [],
    interests: [],
    stay_duration: null,
    role: 'user',
    status: 'active'
  };
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData]);
    
    if (error) {
      console.error('❌ Error creating profile:', error.message);
      
      if (error.code === 'PGRST301') {
        console.log('⚠️ This could be due to RLS policies. You need to be signed in as this user to create their profile.');
        console.log('💡 You should run the SQL in src/utils/createDatabaseStructure.sql in the Supabase SQL Editor.');
      }
    } else {
      console.log('✅ Profile created successfully!');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

// Make function available in global scope
global.createProfile = createProfile;

// Run the profile check
checkProfile(); 