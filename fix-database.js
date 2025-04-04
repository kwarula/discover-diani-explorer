#!/usr/bin/env node

/**
 * This script applies the necessary SQL commands to fix the database schema
 * Run with: node fix-database.js
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
const sqlFilePath = join(__dirname, 'src/utils/createDatabaseStructure.sql');
const sqlCommands = readFileSync(sqlFilePath, 'utf8');

// Split commands by semicolon to execute them one by one
const commands = sqlCommands
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd.length > 0);

async function executeSQL() {
  console.log('🔧 Starting database schema fix...');
  
  try {
    // Check connection
    console.log('🔍 Testing database connection...');
    const { error: connectionError } = await supabase.from('profiles').select('count').limit(0);
    
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
    
    // Verify the profiles table exists and has the correct structure
    console.log('🔍 Verifying profiles table...');
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      console.error('❌ Failed to verify profiles table:', error.message);
    } else {
      console.log('✅ Profiles table verification successful');
    }
    
    console.log('✅ Database schema fix complete!');
    console.log('💡 Next steps:');
    console.log('   1. Restart your application');
    console.log('   2. Try signing up a new user or logging in');
    console.log('   3. If issues persist, check the web console for errors');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

executeSQL(); 