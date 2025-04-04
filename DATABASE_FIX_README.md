# Database Fix Instructions

This guide will help you fix the database schema issues in your Discover Diani Explorer application.

## Issue Description

The application is experiencing a loading issue where the dashboard gets stuck after signing up. This is caused by:

1. Missing or incorrect schema in the Supabase database
2. RLS (Row Level Security) policies that may be too restrictive
3. Incompatibilities between expected database types and actual database schema

## Prerequisites

1. Node.js installed
2. Access to your Supabase project
3. Environment variables set up (`.env` file)

## Setup Environment Variables

Make sure you have the following in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key is required for some database operations. You can find this in your Supabase project settings.

## Fix Options

### Option 1: Using the Automated Script (Recommended)

We've provided a script that will automatically fix your database schema:

1. Install dependencies:
   ```bash
   npm install dotenv @supabase/supabase-js
   ```

2. Run the fix script:
   ```bash
   node fix-database.js
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Option 2: Manual SQL Execution in Supabase Dashboard

If the script doesn't work, you can manually apply the SQL changes:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Open the file `src/utils/createDatabaseStructure.sql`
4. Copy the entire contents and paste it into the SQL Editor
5. Execute the SQL commands

## Verification

To verify the fix worked:

1. Check that the profiles table exists and has the correct schema
2. Attempt to sign up a new user
3. Verify that the dashboard loads correctly after sign up
4. Check the browser console for any errors

## Troubleshooting

If you're still experiencing issues:

1. **Error logs**: Check the browser console and server logs
2. **Database permissions**: Verify RLS policies are correctly set
3. **API key**: Ensure your API keys have the necessary permissions
4. **Schema conflict**: Compare the expected schema in `src/types/database.ts` with your actual database schema

## Need Help?

If you're still having issues, please provide:

1. Any error messages from the console
2. Your Supabase project ID (or create a temporary one for testing)
3. Steps to reproduce the issue

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript Types Generation](https://supabase.com/docs/reference/javascript/typescript-support) 