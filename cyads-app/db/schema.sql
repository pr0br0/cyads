-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE ad_status AS ENUM ('draft', 'published', 'expired', 'sold', 'deleted');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE USING (auth.uid() = id);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_el TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public read access to categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);

-- Locations table (for Cyprus districts/cities)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_el TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  coordinates GEOMETRY(Point, 4326) NOT NULL,
  parent_id UUID REFERENCES locations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public read access to locations
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read locations" ON locations FOR SELECT USING (true);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'EUR',
  category_id UUID NOT NULL REFERENCES categories(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  coordinates GEOMETRY(Point, 4326),
  user_id UUID NOT NULL REFERENCES users(id),
  status ad_status DEFAULT 'published',
  is_featured BOOLEAN DEFAULT false,
  contact_phone TEXT,
  contact_email TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Enable Row Level Security on ads table
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Policies for ads table
CREATE POLICY "Anyone can read published ads" 
  ON ads FOR SELECT USING (status = 'published');
  
CREATE POLICY "Users can CRUD their own ads" 
  ON ads FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can manage all ads" 
  ON ads FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Ad images table
CREATE TABLE IF NOT EXISTS ad_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on ad_images table
ALTER TABLE ad_images ENABLE ROW LEVEL SECURITY;

-- Policies for ad_images table
CREATE POLICY "Anyone can view ad images for published ads" 
  ON ad_images FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ads WHERE id = ad_id AND status = 'published'
    )
  );
  
CREATE POLICY "Users can manage their own ad images" 
  ON ad_images FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ads WHERE id = ad_id AND user_id = auth.uid()
    )
  );

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ad_id)
);

-- Enable Row Level Security on favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies for favorites table
CREATE POLICY "Users can manage their own favorites" 
  ON favorites FOR ALL USING (auth.uid() = user_id);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages table
CREATE POLICY "Users can read their messages" 
  ON messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );
  
CREATE POLICY "Users can send messages" 
  ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS ads_category_id_idx ON ads(category_id);
CREATE INDEX IF NOT EXISTS ads_location_id_idx ON ads(location_id);
CREATE INDEX IF NOT EXISTS ads_user_id_idx ON ads(user_id);
CREATE INDEX IF NOT EXISTS ads_status_idx ON ads(status);
CREATE INDEX IF NOT EXISTS ads_coordinates_idx ON ads USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS ads_title_trgm_idx ON ads USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS ads_description_trgm_idx ON ads USING GIN(description gin_trgm_ops);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at fields
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_ads_updated_at
BEFORE UPDATE ON ads
FOR EACH ROW EXECUTE FUNCTION update_updated_at(); 