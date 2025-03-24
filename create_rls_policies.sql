-- SQL script to set up Row Level Security policies
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/sql)

-- Enable RLS on the ads table if not already enabled
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Policy for reading ads (everyone can read published ads)
CREATE POLICY read_published_ads ON public.ads
    FOR SELECT
    USING (status = 'published');

-- Policy for inserting ads (authenticated users can create ads)
CREATE POLICY insert_own_ads ON public.ads
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for updating ads (users can only update their own ads)
CREATE POLICY update_own_ads ON public.ads
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy for deleting ads (users can only delete their own ads)
CREATE POLICY delete_own_ads ON public.ads
    FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS on storage buckets
-- For ad-images bucket
BEGIN;
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('ad-images', 'ad-images', true)
    ON CONFLICT (id) DO NOTHING;

    -- Policy for reading ad images (public)
    CREATE POLICY read_ad_images ON storage.objects
        FOR SELECT
        USING (bucket_id = 'ad-images');
        
    -- Policy for uploading ad images (authenticated users only)
    CREATE POLICY insert_ad_images ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'ad-images' AND
            auth.uid() IS NOT NULL
        );
COMMIT;

-- For user-avatars bucket
BEGIN;
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('user-avatars', 'user-avatars', true)
    ON CONFLICT (id) DO NOTHING;

    -- Policy for reading user avatars (public)
    CREATE POLICY read_avatars ON storage.objects
        FOR SELECT
        USING (bucket_id = 'user-avatars');
        
    -- Policy for uploading user avatars (authenticated users can upload their own avatar)
    CREATE POLICY insert_avatars ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'user-avatars' AND
            auth.uid() IS NOT NULL
        );
COMMIT;

-- For category-icons bucket
BEGIN;
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('category-icons', 'category-icons', true)
    ON CONFLICT (id) DO NOTHING;

    -- Policy for reading category icons (public)
    CREATE POLICY read_category_icons ON storage.objects
        FOR SELECT
        USING (bucket_id = 'category-icons');
        
    -- Policy for uploading category icons (only administrators should do this, but we'll allow authenticated users for now)
    CREATE POLICY insert_category_icons ON storage.objects
        FOR INSERT
        WITH CHECK (
            bucket_id = 'category-icons' AND
            auth.uid() IS NOT NULL
        );
COMMIT; 