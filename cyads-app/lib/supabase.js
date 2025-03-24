import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Client-side singleton instance
let clientSideSupabase = null;

export const getClientSupabase = () => {
  if (!clientSideSupabase && typeof window !== 'undefined') {
    clientSideSupabase = createSupabaseClient();
  }
  return clientSideSupabase;
}; 