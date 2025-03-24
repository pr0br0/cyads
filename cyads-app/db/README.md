# CyAds Database Setup

This directory contains SQL files to set up the Supabase database for the CyAds classifieds platform.

## Files

- `schema.sql` - Contains all table definitions, indexes, and security policies
- `seed.sql` - Contains initial data for categories and locations in Cyprus

## Setup Instructions

Follow these steps to set up your Supabase database:

### Step 1: Log into Supabase

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your credentials
3. Select your project ("zvyuurbieuionummrcqi")

### Step 2: Set up the Database Schema

1. In the Supabase dashboard, navigate to the SQL Editor
2. Create a new query
3. Copy and paste the contents of `schema.sql` into the editor
4. Run the query to create all tables, policies, and functions

### Step 3: Seed Initial Data

1. Create another new query
2. Copy and paste the contents of `seed.sql` into the editor
3. Run the query to populate categories and locations

### Step 4: Create Storage Buckets

1. Navigate to the Storage section in the Supabase dashboard
2. Create the following buckets:
   - `ad-images` - For storing ad images
   - `avatars` - For user profile photos

3. Set the following bucket policies:

#### ad-images Bucket

- Insert: Only authenticated users
- Select: Public access
- Update: Only owner of files
- Delete: Only owner of files

#### avatars Bucket

- Insert: Only authenticated users
- Select: Public access
- Update: Only owner of files
- Delete: Only owner of files

### Step 5: Configure Authentication

1. Navigate to the Authentication section
2. Enable the following providers:
   - Email
   - Phone
   - Google (optional)
   - Facebook (optional)

3. Configure Site URL and Redirect URLs:
   - Site URL: Your app's URL (e.g., `https://your-app.vercel.app`)
   - Redirect URLs: Add your app's URLs for authentication callbacks

## Database Schema Overview

The database consists of the following main tables:

- `users` - User accounts and profiles
- `categories` - Multilingual category hierarchy
- `locations` - Multilingual Cyprus locations with geocoordinates
- `ads` - Classified advertisements
- `ad_images` - Images associated with ads
- `favorites` - User's favorite ads
- `messages` - Messaging between users about ads

Each table includes Row Level Security (RLS) policies to ensure data security. 