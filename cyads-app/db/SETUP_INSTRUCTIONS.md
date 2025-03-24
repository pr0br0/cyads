# Step-by-Step Supabase Setup Guide

## Log in to Supabase

1. Open your web browser and go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "Sign In" and use your credentials to log in
3. Once logged in, you'll see your project "zvyuurbieuionummrcqi" - click on it to access the dashboard

## Setting Up Database Tables

### Step 1: Access the SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click "New Query" to create a new SQL query

### Step 2: Run Schema Creation Script

1. Open the file `schema.sql` from the `db` folder in your project
2. Copy all its contents
3. Paste the contents into the SQL Editor
4. Click "Run" to execute the query

This will create:
- All necessary database tables (users, categories, locations, ads, etc.)
- Security policies (Row Level Security)
- Indexes for better performance
- Functions and triggers

### Step 3: Seed Initial Data

1. Click "New Query" again to create another SQL query
2. Open the file `seed.sql` from the `db` folder in your project
3. Copy all its contents
4. Paste the contents into the SQL Editor
5. Click "Run" to execute the query

This will populate:
- Categories and subcategories (with multilingual names)
- Cyprus locations (cities and areas with geocoordinates)

### Step 4: Verify Table Creation

1. Click on "Table Editor" in the left sidebar
2. You should now see all your tables listed:
   - users
   - categories
   - locations
   - ads
   - ad_images
   - favorites
   - messages
3. Click on each table to verify its structure and data

## Setting Up Storage Buckets

### Step 1: Access Storage

1. Click on "Storage" in the left sidebar
2. Click "Create a new bucket"

### Step 2: Create Ad Images Bucket

1. Enter `ad-images` as the bucket name
2. Select "Private" for bucket type (we'll set specific policies)
3. Click "Create bucket"

### Step 3: Configure Ad Images Bucket Policies

1. Click on the `ad-images` bucket
2. Go to the "Policies" tab
3. Create the following policies:

#### For SELECT operations (viewing images):
- Policy name: "Anyone can view ad images"
- Policy definition: `true` (allows public access)
- Click "Save policy"

#### For INSERT operations (uploading images):
- Policy name: "Authenticated users can upload images"
- Policy definition: `auth.role() = 'authenticated'`
- Click "Save policy"

#### For UPDATE operations (changing images):
- Policy name: "Users can update their own images"
- Policy definition: `auth.uid() IN (SELECT user_id FROM ads WHERE id = ad_id)`
- Click "Save policy"

#### For DELETE operations (removing images):
- Policy name: "Users can delete their own images"
- Policy definition: `auth.uid() IN (SELECT user_id FROM ads WHERE id = ad_id)`
- Click "Save policy"

### Step 4: Create Avatars Bucket

1. Return to Storage main page
2. Click "Create a new bucket"
3. Enter `avatars` as the bucket name
4. Select "Private" for bucket type
5. Click "Create bucket"

### Step 5: Configure Avatars Bucket Policies

1. Click on the `avatars` bucket
2. Go to the "Policies" tab
3. Create the following policies:

#### For SELECT operations (viewing avatars):
- Policy name: "Anyone can view avatars"
- Policy definition: `true` (allows public access)
- Click "Save policy"

#### For INSERT operations (uploading avatars):
- Policy name: "Authenticated users can upload avatars"
- Policy definition: `auth.role() = 'authenticated'`
- Click "Save policy"

#### For UPDATE/DELETE operations:
- Policy name: "Users can manage their own avatars"
- Policy definition: `auth.uid()::text = (storage.foldername)[1]`
- Click "Save policy"

## Setting Up Authentication

### Step 1: Access Authentication Settings

1. Click on "Authentication" in the left sidebar
2. Go to the "Providers" tab

### Step 2: Configure Email Provider

1. Make sure "Email" is enabled
2. Enable "Confirm email" option for better security

### Step 3: Configure Phone Provider

1. Toggle on the "Phone" provider
2. If you have a Twilio account, add your credentials; otherwise, use Supabase's test provider (limited to specific numbers)

### Step 4: (Optional) Configure Social Providers

1. For Google authentication:
   - Follow the instructions in the "Google" tab to set up a Google OAuth client
   - Add your Google client ID and secret
   
2. For Facebook authentication:
   - Follow the instructions in the "Facebook" tab to set up a Facebook OAuth app
   - Add your Facebook app ID and secret

### Step 5: Configure URL Settings

1. Go to the "URL Configuration" tab
2. Set the Site URL to your application's URL (e.g., `https://your-app.vercel.app`)
3. Add redirect URLs for authentication callbacks (e.g., `https://your-app.vercel.app/auth/callback`)

## Finalizing Setup

### Test the Database Connection

1. Go back to your Next.js application
2. Make sure your `.env.local` file has the correct Supabase URL and anon key
3. Run your application locally to verify connections to Supabase
4. Navigate to different pages to ensure data is being properly fetched

Your Supabase backend is now fully set up for the CyAds application! 