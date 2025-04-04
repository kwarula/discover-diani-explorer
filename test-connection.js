#!/usr/bin/env node

/**
 * Simple script to test Supabase connection
 * Run with: node test-connection.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

// Check for environment variables
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error(`${colors.red}Missing Supabase environment variables. Check your .env file.${colors.reset}`);
  console.error(`${colors.yellow}Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY${colors.reset}`);
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function runTests() {
  console.log(`${colors.bold}${colors.blue}======= Supabase Connection Test =======${colors.reset}\n`);
  
  let success = true;
  
  // Test 1: Basic connection test
  try {
    console.log(`${colors.cyan}[TEST 1]${colors.reset} Testing basic connection...`);
    const { data, error } = await supabase.from('profiles').select('count').limit(0);
    
    if (error) {
      console.error(`${colors.red}✘ Connection failed:${colors.reset}`, error.message);
      console.error(`${colors.yellow}→ This could be due to network issues or incorrect API credentials${colors.reset}`);
      success = false;
    } else {
      console.log(`${colors.green}✓ Connection successful!${colors.reset}`);
    }
  } catch (err) {
    console.error(`${colors.red}✘ Connection test exception:${colors.reset}`, err.message);
    success = false;
  }
  
  // Test 2: Check profiles table existence
  try {
    console.log(`\n${colors.cyan}[TEST 2]${colors.reset} Checking profiles table...`);
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      if (error.code === 'PGRST204') {
        console.error(`${colors.red}✘ The 'profiles' table does not exist!${colors.reset}`);
      } else {
        console.error(`${colors.red}✘ Error accessing profiles table:${colors.reset}`, error.message);
      }
      success = false;
    } else {
      console.log(`${colors.green}✓ Profiles table exists and is accessible!${colors.reset}`);
      
      // Check schema columns
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`   Table columns: ${colors.magenta}${columns.join(', ')}${colors.reset}`);
        
        // Check for required columns
        const requiredColumns = ['id', 'role', 'status', 'username', 'full_name'];
        const missingColumns = requiredColumns.filter(col => !columns.includes(col));
        
        if (missingColumns.length > 0) {
          console.warn(`${colors.yellow}⚠ Missing columns:${colors.reset} ${missingColumns.join(', ')}`);
          console.warn(`${colors.yellow}→ You may need to run the database fix script${colors.reset}`);
        } else {
          console.log(`${colors.green}✓ All required columns present!${colors.reset}`);
        }
      } else {
        console.log(`   No profile records found (empty table)`);
      }
    }
  } catch (err) {
    console.error(`${colors.red}✘ Profiles table test exception:${colors.reset}`, err.message);
    success = false;
  }
  
  // Test 3: Check RLS policies
  try {
    console.log(`\n${colors.cyan}[TEST 3]${colors.reset} Testing RLS policies...`);
    
    // Try inserting a test profile (should fail with anon key due to RLS)
    const testUuid = '00000000-0000-0000-0000-000000000000'; // Example UUID that shouldn't exist
    const { error } = await supabase
      .from('profiles')
      .insert([{ 
        id: testUuid,
        full_name: 'Test User'
      }]);
    
    if (error) {
      if (error.code === 'PGRST301') {
        console.log(`${colors.green}✓ RLS policies active and restricting inserts (good)!${colors.reset}`);
      } else {
        console.log(`${colors.yellow}⚠ RLS test produced an unexpected error:${colors.reset}`, error.message);
      }
    } else {
      console.warn(`${colors.yellow}⚠ Warning: Was able to insert with anon key - RLS policies may not be properly configured${colors.reset}`);
      
      // Clean up test entry
      await supabase.from('profiles').delete().eq('id', testUuid);
    }
  } catch (err) {
    console.error(`${colors.red}✘ RLS test exception:${colors.reset}`, err.message);
  }
  
  // Final result
  console.log(`\n${colors.bold}${colors.blue}======= Test Results =======${colors.reset}`);
  if (success) {
    console.log(`${colors.green}${colors.bold}✓ All core tests passed!${colors.reset}`);
    console.log(`${colors.green}→ Your database connection appears to be working properly.${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}✘ Some tests failed!${colors.reset}`);
    console.log(`${colors.yellow}→ Run the fix-database.js script to address schema issues.${colors.reset}`);
    console.log(`${colors.yellow}→ Check your .env file to ensure correct credentials.${colors.reset}`);
  }
}

runTests(); 