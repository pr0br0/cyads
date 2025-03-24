-- Create tables
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    location TEXT NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ads table
CREATE TRIGGER handle_ads_updated_at
    BEFORE UPDATE ON public.ads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Categories: Anyone can read, only authenticated users can create/update/delete
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Categories are manageable by authenticated users" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Ads: Anyone can read, authenticated users can create their own, users can update/delete their own
CREATE POLICY "Ads are viewable by everyone" ON public.ads
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own ads" ON public.ads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ads" ON public.ads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ads" ON public.ads
    FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for ad images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-images', 'ad-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Ad images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'ad-images');

CREATE POLICY "Users can upload their own ad images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'ad-images' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Users can update their own ad images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'ad-images' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Users can delete their own ad images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'ad-images' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    ); 