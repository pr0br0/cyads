require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`SUPABASE_URL: ${supabaseUrl}`);
console.log('Setting up database and creating test data...');

async function setupAll() {
  try {
    // Step 1: Create tables manually instead of using SQL file
    console.log('Setting up database tables and policies...');
    
    // Create categories table
    const { error: categoriesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.categories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `
    });
    
    if (categoriesError) {
      console.error('Error creating categories table:', categoriesError);
      console.log('Attempting direct API calls instead...');
    } else {
      console.log('Categories table created successfully!');
    }
    
    // Create ads table
    const { error: adsError } = await supabase.rpc('execute_sql', {
      sql_query: `
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `
    });
    
    if (adsError) {
      console.error('Error creating ads table:', adsError);
    } else {
      console.log('Ads table created successfully!');
    }
    
    // Step 2: Create a test user
    console.log('Creating a test user...');
    const email = `testuser.${Math.floor(Date.now() / 1000)}@example.com`;
    const password = 'password123';
    
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (userError) {
      console.error('Error creating test user:', userError);
      return;
    }
    
    console.log(`Test user created: ${email}`);
    const userId = userData.user.id;
    
    // Step 3: Auto-confirm the user (we do this in the Supabase dashboard setting)
    console.log('User confirmation is handled by Supabase auto-confirm setting');
    
    // Step 4: Sign in with the test user
    console.log('Signing in with the test user...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      console.error('Error signing in:', signInError);
      console.log('Please enable auto-confirm in the Supabase dashboard:');
      console.log('1. Go to https://supabase.com/dashboard/project/zvyuurbieuionummrcqi/auth/providers');
      console.log('2. Enable "Email Auth" and "Auto-confirm"');
      console.log('3. Save your changes and run this script again');
      return;
    }
    
    console.log('Signed in successfully!');
    
    // Step 5: Create categories
    console.log('Creating categories...');
    
    const categories = [
      { name: 'Property', slug: 'property', description: 'Houses, apartments, and land for sale or rent' },
      { name: 'Vehicles', slug: 'vehicles', description: 'Cars, motorcycles, and other vehicles' },
      { name: 'Electronics', slug: 'electronics', description: 'Phones, computers, and other electronics' },
      { name: 'Jobs', slug: 'jobs', description: 'Job listings and employment opportunities' },
      { name: 'Services', slug: 'services', description: 'Professional and personal services' },
      { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
      { name: 'Clothing', slug: 'clothing', description: 'New and used clothing items' },
      { name: 'Books', slug: 'books', description: 'Books, textbooks, and publications' },
      { name: 'Sports', slug: 'sports', description: 'Sports equipment and accessories' },
      { name: 'Hobbies', slug: 'hobbies', description: 'Items related to various hobbies' },
      { name: 'Baby Items', slug: 'baby-items', description: 'Products for babies and children' },
      { name: 'Pets', slug: 'pets', description: 'Pets and pet supplies' }
    ];
    
    for (const category of categories) {
      const { error: categoryError } = await supabase
        .from('categories')
        .upsert([category]);
      
      if (categoryError) {
        console.error(`Error creating category ${category.name}:`, categoryError);
      } else {
        console.log(`Category created: ${category.name}`);
      }
    }
    
    // Get the category IDs
    const { data: categoryData, error: categoryFetchError } = await supabase
      .from('categories')
      .select('id, slug');
    
    if (categoryFetchError) {
      console.error('Error fetching categories:', categoryFetchError);
      return;
    }
    
    const categoryMap = {};
    categoryData.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    // Create test ads
    console.log('Creating test ads...');
    const testAds = [
      {
        title: 'Luxury Apartment for Rent in Limassol',
        description: 'Beautiful 2-bedroom apartment with sea view, fully furnished with modern amenities.',
        price: 1200,
        currency: 'EUR',
        location: 'Limassol, Cyprus',
        image_url: 'https://picsum.photos/800/600',
        category_id: categoryMap['property'],
        user_id: userId
      },
      {
        title: '2019 Mercedes-Benz C-Class',
        description: 'Excellent condition, low mileage, full service history, all extras included.',
        price: 24500,
        currency: 'EUR',
        location: 'Nicosia, Cyprus',
        image_url: 'https://picsum.photos/800/600?random=1',
        category_id: categoryMap['vehicles'],
        user_id: userId
      },
      {
        title: 'iPhone 13 Pro - Like New',
        description: 'Used for only 3 months, comes with original box and accessories, no scratches.',
        price: 650,
        currency: 'EUR',
        location: 'Larnaca, Cyprus',
        image_url: 'https://picsum.photos/800/600?random=2',
        category_id: categoryMap['electronics'],
        user_id: userId
      },
      {
        title: 'Full-Time Marketing Manager',
        description: 'Established company looking for an experienced marketing professional. Competitive salary and benefits.',
        price: 0,
        currency: 'EUR',
        location: 'Paphos, Cyprus',
        image_url: 'https://picsum.photos/800/600?random=3',
        category_id: categoryMap['jobs'],
        user_id: userId
      }
    ];
    
    for (const ad of testAds) {
      const { error: adError } = await supabase
        .from('ads')
        .insert([ad]);
      
      if (adError) {
        console.error(`Error creating ad "${ad.title}":`, adError);
      } else {
        console.log(`Ad created: ${ad.title}`);
      }
    }
    
    console.log('\nSetup completed! You can now use the test account:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\nOr create your own account through the app.');
    
  } catch (error) {
    console.error('Unexpected error during setup:', error);
  }
}

setupAll(); 