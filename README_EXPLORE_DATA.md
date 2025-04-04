# Loading Explore Page Data

This README provides instructions for loading sample data for the Explore page, including Beaches, Activities, Attractions, and Dining options.

## Overview

The Explore page requires data in the following categories:
- **Beaches**: Stored as Points of Interest in the database
- **Activities**: Outdoor activities and experiences visitors can book
- **Attractions**: Places to visit and explore in the Diani area
- **Dining**: Restaurants, cafes, and eating options

## Prerequisites

1. You need a working Supabase project
2. You need the Supabase URL and a Service Role Key (required for bypassing RLS)
3. The database tables should already be created

## Setup Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for these scripts to work properly. This key has elevated permissions and should not be exposed in client-side code.

## Loading Sample Data

We've created several different options to load the sample data:

### Option 1: Complete Setup Script (Recommended)

The comprehensive setup script handles everything in one step:
1. Creates necessary SQL execution functions
2. Temporarily disables RLS
3. Loads all sample data
4. Re-enables RLS
5. Verifies the data

```bash
# Make the script executable
chmod +x setup-explore-page.js

# Run the script
node setup-explore-page.js
```

This is the easiest and most reliable method, as it handles all the setup and potential error conditions.

### Option 2: Using `execute_sql` RPC Function

If you already have the `execute_sql` or `exec_sql` functions in your Supabase project:

```bash
chmod +x load-explore-data-superuser.js
node load-explore-data-superuser.js
```

### Option 3: Direct Inserts with Regular API Calls

If neither of the above methods work:

```bash
chmod +x load-explore-data-direct.js
node load-explore-data-direct.js
```

> Note: This method might still encounter RLS policy restrictions.

### Option 4: Manual SQL Execution in Supabase Dashboard

If all scripts fail, you can manually execute the SQL in the Supabase dashboard:

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Copy the content from `create-execute-sql-function.sql` and execute it
4. Copy the content from `supabase/migrations/20250704_seed_explore_categories.sql` and execute it

## Customizing the Sample Data

To modify or extend the sample data:

1. Edit the appropriate data array in the script files
2. Alternatively, edit the SQL file directly at `supabase/migrations/20250704_seed_explore_categories.sql`
3. Run the setup script again

For images, we're currently using Unsplash sample images. For a production site, these should be replaced with your own images stored in Supabase Storage.

## Troubleshooting

If you encounter errors like:

- **RLS Policy Violations**: Make sure you're using the service role key in the `.env` file
- **Table or Column Not Found**: Check that your database schema matches what's expected in the script
- **Function Not Found**: The setup script should handle this, but if not, create the function manually using `create-execute-sql-function.sql`
- **SQL Syntax Errors**: If specific SQL statements fail, you may need to adjust them based on your database schema

## Next Steps

After loading the data:
1. Restart your application
2. Navigate to the Explore page to see the data
3. Check that all categories display correctly 