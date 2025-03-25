import { createClient } from '@supabase/supabase-js'
import type { Database, TypedSupabaseClient } from '@/types/database'

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zvyuurbieuionummrcqi.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eXV1cmJpZXVpb251bW1yY3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI8NDA0MTIsImV4cCI6MjA1ODQxNjQxMn0.IKZgwRcmGPhYHDuvkRAco9lWk5GXjAT568ZD3XmodEU'

// Create a typed Supabase client for server-side usage
export const supabase: TypedSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Function to create a client-side Supabase client
let clientSideSupabase: TypedSupabaseClient | null = null
export function getSupabaseClient(): TypedSupabaseClient {
  if (!clientSideSupabase && typeof window !== 'undefined') {
    clientSideSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return clientSideSupabase || supabase
}

// Type definitions for our data models
export interface Category {
  id: string
  name_en: string
  name_el: string
  name_ru: string
  slug: string
  icon?: string | null
  color?: string | null
  parent_id?: string | null
  name?: string
}

export interface Location {
  id: string
  name_en: string
  name_el: string
  name_ru: string
  slug: string
  coordinates: unknown
  parent_id?: string | null
  name?: string
}

export interface Ad {
  id: string
  title: string
  description: string
  price?: number | null
  currency?: string | null
  created_at: string
  category?: Category
  location?: Location
  user?: {
    id: string
    first_name?: string | null
    last_name?: string | null
  }
}

// Helper type for typed query results
type QueryResult<T> = T[]

// Helper function for safe property access
function getLocalizedName<T extends { name_en: string }>(
  item: T,
  locale: string,
  fallback: keyof T = 'name_en'
): string {
  const localizedKey = `name_${locale}` as keyof T
  return (item[localizedKey] || item[fallback]) as string
}

// Data fetching functions with proper typing
export async function getCategories(locale = 'en'): Promise<QueryResult<Category>> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name_en, name_el, name_ru, icon, color, parent_id')
    .order('name_en')
    
  if (error || !data) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  return data.map(category => ({
    ...category,
    name: getLocalizedName(category, locale)
  }))
}

export async function getLocations(locale = 'en'): Promise<QueryResult<Location>> {
  const { data, error } = await supabase
    .from('locations')
    .select('id, slug, name_en, name_el, name_ru, coordinates, parent_id')
    .order('name_en')
    
  if (error || !data) {
    console.error('Error fetching locations:', error)
    return []
  }
  
  return data.map(location => ({
    ...location,
    name: getLocalizedName(location, locale)
  }))
}

type AdWithRelations = Database['public']['Tables']['ads']['Row'] & {
  categories: Category
  locations: Location
  users: {
    id: string
    first_name: string | null
    last_name: string | null
  }
}

export async function getFeaturedAds(locale = 'en', limit = 4): Promise<QueryResult<Ad>> {
  const { data, error } = await supabase
    .from('ads')
    .select<`
      id, title, description, price, currency, created_at,
      categories(id, slug, name_en, name_el, name_ru),
      locations(id, slug, name_en, name_el, name_ru),
      users(id, first_name, last_name)
    `, AdWithRelations>(`
      id, title, description, price, currency, created_at,
      categories(id, slug, name_en, name_el, name_ru),
      locations(id, slug, name_en, name_el, name_ru),
      users(id, first_name, last_name)
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (error || !data) {
    console.error('Error fetching featured ads:', error)
    return []
  }
  
  return data.map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    currency: ad.currency,
    created_at: ad.created_at,
    category: {
      ...ad.categories,
      name: getLocalizedName(ad.categories, locale)
    },
    location: {
      ...ad.locations,
      name: getLocalizedName(ad.locations, locale)
    },
    user: ad.users
  }))
}

export async function getAdsByCategory(category: string, locale = 'en', limit = 10): Promise<QueryResult<Ad>> {
  const { data, error } = await supabase
    .from('ads')
    .select<`
      id, title, description, price, currency, created_at,
      categories!inner(id, slug, name_en, name_el, name_ru),
      locations(id, slug, name_en, name_el, name_ru),
      users(id, first_name, last_name)
    `, AdWithRelations>(`
      id, title, description, price, currency, created_at,
      categories!inner(id, slug, name_en, name_el, name_ru),
      locations(id, slug, name_en, name_el, name_ru),
      users(id, first_name, last_name)
    `)
    .eq('status', 'published')
    .eq('categories.slug', category)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (error || !data) {
    console.error('Error fetching ads by category:', error)
    return []
  }
  
  return data.map(ad => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    currency: ad.currency,
    created_at: ad.created_at,
    category: {
      ...ad.categories,
      name: getLocalizedName(ad.categories, locale)
    },
    location: {
      ...ad.locations,
      name: getLocalizedName(ad.locations, locale)
    },
    user: ad.users
  }))
}
