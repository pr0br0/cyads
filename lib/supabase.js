import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zvyuurbieuionummrcqi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU';

// Create a single supabase client for server-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to create a client-side Supabase client
let clientSideSupabase = null;
export function getSupabaseClient() {
  if (!clientSideSupabase && typeof window !== 'undefined') {
    clientSideSupabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return clientSideSupabase || supabase;
}

// Data fetching functions
export async function getCategories(locale = 'en') {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name_en, name_el, name_ru, icon, color, parent_id')
    .order('name_en');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  // Add localized name property based on the locale
  return data.map(category => ({
    ...category,
    name: category[`name_${locale}`] || category.name_en
  }));
}

export async function getLocations(locale = 'en') {
  const { data, error } = await supabase
    .from('locations')
    .select('id, slug, name_en, name_el, name_ru, coordinates, parent_id')
    .order('name_en');
    
  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
  
  // Add localized name property based on the locale
  return data.map(location => ({
    ...location,
    name: location[`name_${locale}`] || location.name_en
  }));
}

export async function getFeaturedAds(locale = 'en', limit = 4) {
  const { data, error } = await supabase
    .from('ads')
    .select(`
      id, title, description, price, currency, created_at,
      categories(id, slug, name_en, name_el, name_ru),
      locations(id, slug, name_en, name_el, name_ru),
      users(id, first_name, last_name)
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching featured ads:', error);
    return [];
  }
  
  // Format the data with localized names
  return data.map(ad => ({
    ...ad,
    category: {
      ...ad.categories,
      name: ad.categories[`name_${locale}`] || ad.categories.name_en
    },
    location: {
      ...ad.locations,
      name: ad.locations[`name_${locale}`] || ad.locations.name_en
    }
  }));
}

export async function getAdsByCategory(category, locale = 'en', limit = 10) {
  const { data, error } = await supabase
    .from('ads')
    .select(`
      id, title, description, price, currency, created_at,
      categories!inner(id, slug, name_en, name_el, name_ru),
      locations(id, slug, name_en, name_el, name_ru),
      users(id, first_name, last_name)
    `)
    .eq('status', 'published')
    .eq('categories.slug', category)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching ads by category:', error);
    return [];
  }
  
  // Format the data with localized names
  return data.map(ad => ({
    ...ad,
    category: {
      ...ad.categories,
      name: ad.categories[`name_${locale}`] || ad.categories.name_en
    },
    location: {
      ...ad.locations,
      name: ad.locations[`name_${locale}`] || ad.locations.name_en
    }
  }));
} 