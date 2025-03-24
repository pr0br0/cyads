import { createSupabaseClient } from './supabase';

// Categories
export const getCategories = async (locale = 'en') => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, parent_id, color, icon')
    .order('name_en');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  // Add the localized name based on the locale
  return data.map(category => ({
    ...category,
    name: category[`name_${locale}`] || category.name_en
  }));
};

// Locations
export const getLocations = async (locale = 'en') => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('locations')
    .select('id, slug, parent_id, coordinates')
    .order('name_en');
    
  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
  
  // Add the localized name based on the locale
  return data.map(location => ({
    ...location,
    name: location[`name_${locale}`] || location.name_en
  }));
};

// Ads
export const getAds = async ({
  category = null,
  location = null,
  searchTerm = '',
  limit = 20,
  offset = 0,
  locale = 'en'
}) => {
  const supabase = createSupabaseClient();
  
  let query = supabase
    .from('ads')
    .select(`
      id, title, description, price, currency, 
      status, is_featured, view_count, created_at, expires_at,
      categories!inner(id, slug, name_en, name_el, name_ru),
      locations!inner(id, slug, name_en, name_el, name_ru),
      users!inner(id, first_name, last_name, avatar_url),
      ad_images(id, storage_path, is_primary)
    `)
    .eq('status', 'published')
    .lt('expires_at', 'now()')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });
  
  // Apply category filter if provided
  if (category) {
    query = query.eq('categories.slug', category);
  }
  
  // Apply location filter if provided
  if (location) {
    query = query.eq('locations.slug', location);
  }
  
  // Apply search term if provided
  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  
  // Apply pagination
  query = query.range(offset, offset + limit - 1);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching ads:', error);
    return { ads: [], count: 0 };
  }
  
  // Process the data to make it easier to work with
  const processedAds = data.map(ad => {
    // Get the primary image if any
    const primaryImage = ad.ad_images.find(img => img.is_primary) || ad.ad_images[0];
    
    return {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      currency: ad.currency,
      isFeatured: ad.is_featured,
      viewCount: ad.view_count,
      createdAt: ad.created_at,
      expiresAt: ad.expires_at,
      category: {
        id: ad.categories.id,
        slug: ad.categories.slug,
        name: ad.categories[`name_${locale}`] || ad.categories.name_en
      },
      location: {
        id: ad.locations.id,
        slug: ad.locations.slug,
        name: ad.locations[`name_${locale}`] || ad.locations.name_en
      },
      user: {
        id: ad.users.id,
        name: `${ad.users.first_name || ''} ${ad.users.last_name || ''}`.trim(),
        avatarUrl: ad.users.avatar_url
      },
      image: primaryImage ? primaryImage.storage_path : null,
      imageCount: ad.ad_images.length
    };
  });
  
  return { ads: processedAds, count };
};

// Ad Details
export const getAdById = async (id, locale = 'en') => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('ads')
    .select(`
      id, title, description, price, currency, 
      status, is_featured, contact_phone, contact_email,
      view_count, created_at, expires_at, coordinates,
      categories!inner(id, slug, name_en, name_el, name_ru),
      locations!inner(id, slug, name_en, name_el, name_ru),
      users!inner(id, first_name, last_name, avatar_url),
      ad_images(id, storage_path, is_primary)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching ad details:', error);
    return null;
  }
  
  // Increment view count
  await supabase
    .from('ads')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', id);
  
  // Return processed ad details
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    price: data.price,
    currency: data.currency,
    contactPhone: data.contact_phone,
    contactEmail: data.contact_email,
    isFeatured: data.is_featured,
    viewCount: data.view_count,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
    coordinates: data.coordinates,
    category: {
      id: data.categories.id,
      slug: data.categories.slug,
      name: data.categories[`name_${locale}`] || data.categories.name_en
    },
    location: {
      id: data.locations.id,
      slug: data.locations.slug,
      name: data.locations[`name_${locale}`] || data.locations.name_en
    },
    user: {
      id: data.users.id,
      name: `${data.users.first_name || ''} ${data.users.last_name || ''}`.trim(),
      avatarUrl: data.users.avatar_url
    },
    images: data.ad_images.map(img => ({
      id: img.id,
      url: img.storage_path,
      isPrimary: img.is_primary
    }))
  };
}; 