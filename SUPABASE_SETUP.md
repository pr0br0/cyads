# Supabase Setup for CyAds

This document provides step-by-step instructions for setting up your Supabase instance for the CyAds classifieds application.

## Access Your Supabase Project

1. Go to [https://supabase.com/dashboard/project/zvyuurbieuionummrcqi](https://supabase.com/dashboard/project/zvyuurbieuionummrcqi)
2. Log in to your Supabase account

## Enable Email Auto-Confirmation (for testing)

1. Go to [Authentication Settings](https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/auth/settings)
2. Under "Email Auth", find "Confirm email" setting
3. Enable it and select "Auto-confirm" from the dropdown
4. Click "Save"

## Confirm Existing Test Users

If you've already created test users that need confirmation:

1. Go to [SQL Editor](https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/sql)
2. Paste the contents of `confirm_user.sql` and run it
3. This will confirm all users with emails like "testuser.*@gmail.com"

## Create Storage Buckets

1. Go to [Storage](https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/storage/buckets)
2. Create the following buckets:
   - `ad-images` (set to public)
   - `user-avatars` (set to public)
   - `category-icons` (set to public)

## Set Up Row Level Security (RLS) Policies

1. Go to [SQL Editor](https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/sql)
2. Paste the contents of `create_rls_policies.sql` and run it
3. This will:
   - Enable RLS on the ads table
   - Create policies for reading, inserting, updating, and deleting ads
   - Create storage buckets if they don't exist
   - Set up policies for storage buckets

## Create Test Ads

After completing the above steps:

1. Run the following command in your terminal:
   ```
   node create-test-ad.js
   ```
2. This will:
   - Create a test user
   - Sign in with the new user
   - Create sample ads with the user

## Verify Setup

1. Go to [Table Editor](https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/editor)
2. Check the `ads` table to see your test ads
3. Go to [Storage](https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/storage/buckets) to verify your buckets

## Additional Tips

### Database Schema Overview

The CyAds database has the following main tables:
- `users`: User accounts
- `categories`: Ad categories (property, vehicles, jobs, etc.)
- `locations`: Locations in Cyprus
- `ads`: The classified advertisements
- `ad_images`: Images associated with ads

### Testing Authentication

To test authentication in your application:
1. Make sure auto-confirmation is enabled
2. Use the following test credentials:
   - Email: Any email in the format `testuser.TIMESTAMP@gmail.com`
   - Password: `Password123!`

### API Endpoints

All database access should be done through Supabase client libraries, which provide a convenient API for:
- Authentication (signup, login, logout)
- Database queries (select, insert, update, delete)
- Storage operations (upload, download, list files)

## Next Steps

After completing the Supabase setup:
1. Integrate the Supabase client in your CyAds frontend
2. Implement user authentication flows
3. Create forms for posting and editing ads
4. Implement file uploads for ad images
5. Build the search and filtering functionality 

git add .
git commit -m "Add authentication, dashboard, and ad creation"
git push 