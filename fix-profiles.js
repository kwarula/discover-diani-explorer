#!/usr/bin/env node

/**
 * Script to apply the fix-profiles migration
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(`${colors.red}Missing Supabase environment variables. Check your .env file.${colors.reset}`);
  console.error(`${colors.yellow}Make sure your .env file has:${colors.reset}`);
  console.error(`  VITE_SUPABASE_URL=<your-supabase-url>`);
  console.error(`  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`);
  process.exit(1);
}

// Initialize Supabase admin client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Path to the migration file
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20260202000000_fix_profiles_rls_and_defaults.sql');

async function applyProfilesFix() {
  try {
    console.log(`${colors.cyan}Reading migration file...${colors.reset}`);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`${colors.yellow}Found ${statements.length} SQL statements to execute${colors.reset}`);
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      const description = statement.split('\n')[0].replace('--', '').trim();
      
      try {
        console.log(`${colors.blue}Executing statement ${i+1}/${statements.length}: ${description || 'SQL command'}${colors.reset}`);
        const { error } = await supabase.rpc('exec_sql', { query: statement });
        
        if (error) {
          console.error(`${colors.red}Error executing statement ${i+1}:${colors.reset}`, error);
          console.error(`${colors.yellow}Statement:${colors.reset} ${statement.substring(0, 100)}...`);
        }
      } catch (err) {
        console.error(`${colors.red}Exception on statement ${i+1}:${colors.reset}`, err);
      }
    }
    
    console.log(`${colors.green}✅ Migration completed${colors.reset}`);
    
    // Verify profiles table
    console.log(`${colors.cyan}Verifying profiles table...${colors.reset}`);
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
      
    if (error) {
      console.error(`${colors.red}Error verifying profiles table:${colors.reset}`, error);
    } else {
      console.log(`${colors.green}Profiles table verification successful${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`${colors.red}Failed to apply migration:${colors.reset}`, error);
    process.exit(1);
  }
}

// Execute the function
applyProfilesFix(); 