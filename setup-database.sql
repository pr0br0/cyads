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
    currency TEXT NOT NULL DEFAULT 'EUR',
    location TEXT NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'expired')),
    is_approved BOOLEAN DEFAULT false,
    auto_approved BOOLEAN DEFAULT false,
    moderation_notes TEXT,
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

-- Insert some categories
INSERT INTO public.categories (name, slug, description) VALUES
('Property', 'property', 'Houses, apartments, and land for sale or rent'),
('Vehicles', 'vehicles', 'Cars, motorcycles, and other vehicles'),
('Jobs', 'jobs', 'Job listings and employment opportunities'),
('Services', 'services', 'Professional and personal services'),
('Electronics', 'electronics', 'Phones, computers, and other electronics'),
('Furniture', 'furniture', 'Home and office furniture'),
('Clothing', 'clothing', 'New and used clothing items'),
('Books', 'books', 'Books, textbooks, and publications'),
('Sports', 'sports', 'Sports equipment and accessories'),
('Hobbies', 'hobbies', 'Items related to various hobbies'),
('Baby Items', 'baby-items', 'Products for babies and children'),
('Pets', 'pets', 'Pets and pet supplies');

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, ad_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add PostGIS extension for location data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add location coordinates to ads table
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS coordinates GEOMETRY(Point, 4326);

-- Create trigger for profiles updated_at
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS for new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- Create policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS ads_location_idx ON public.ads USING GIST (coordinates);
CREATE INDEX IF NOT EXISTS ads_created_at_idx ON public.ads(created_at DESC);
CREATE INDEX IF NOT EXISTS messages_participants_idx ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS favorites_user_idx ON public.favorites(user_id);

-- Create function for auto-approving ads with enhanced criteria
CREATE OR REPLACE FUNCTION public.auto_approve_ad()
RETURNS TRIGGER AS $$
DECLARE
    user_ad_count INTEGER;
    user_approved_ratio DECIMAL;
    user_account_age INTERVAL;
BEGIN
    -- Get user's statistics
    SELECT 
        COUNT(*) as total_ads,
        COUNT(*) FILTER (WHERE status = 'active') / COUNT(*)::DECIMAL as approval_ratio,
        NOW() - created_at as account_age
    INTO user_ad_count, user_approved_ratio, user_account_age
    FROM public.ads
    WHERE user_id = NEW.user_id
    GROUP BY user_id;

    -- Auto-approve if ANY of these conditions are met:
    IF (
        -- Condition 1: User has verified phone
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = NEW.user_id 
            AND phone IS NOT NULL
        )
        -- Condition 2: User has good history (>80% approval rate and at least 5 ads)
        OR (user_ad_count >= 5 AND user_approved_ratio >= 0.8)
        -- Condition 3: Account is older than 30 days and has at least 3 approved ads
        OR (user_account_age >= INTERVAL '30 days' AND user_ad_count >= 3 AND user_approved_ratio >= 0.7)
        -- Condition 4: Basic content validation
        OR (
            NEW.title IS NOT NULL 
            AND LENGTH(NEW.title) >= 10 
            AND LENGTH(NEW.description) >= 30
            AND NEW.image_url IS NOT NULL
            AND NEW.price > 0
        )
    ) THEN
        -- Auto-approve the ad
        NEW.status := 'active';
        NEW.is_approved := true;
        NEW.auto_approved := true;
        NEW.moderation_notes := 'Auto-approved based on user reputation and content quality';
    ELSE
        -- Set to pending with explanation
        NEW.status := 'pending';
        NEW.moderation_notes := 'Manual review required. New user or insufficient history.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-approval
DROP TRIGGER IF EXISTS auto_approve_ad_trigger ON public.ads;
CREATE TRIGGER auto_approve_ad_trigger
    BEFORE INSERT ON public.ads
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_approve_ad();

-- Add indexes to improve performance
CREATE INDEX IF NOT EXISTS idx_ads_user_status ON public.ads(user_id, status);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(id) WHERE phone IS NOT NULL; 