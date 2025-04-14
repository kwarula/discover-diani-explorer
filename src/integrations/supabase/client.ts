
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Hardcoded Supabase project details
const SUPABASE_URL = 'https://jrhjzevapgsbvurzimov.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaGp6ZXZhcGdzYnZ1cnppbW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDc2NDMsImV4cCI6MjA1OTEyMzY0M30.E4aPyY-tYxvYMgeqFucJEs-9rTWw_dbaRuaqhbYq0Rg';

// Create supabase client with improved configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', 
    storage: localStorage, 
    debug: false,
    storageKey: 'discover-diani-auth-token', 
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), 
      });
    },
  },
});

// Export a custom function to check database health
export const checkSupabaseHealth = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(0);
    if (error) {
      console.error('Database health check failed:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};
