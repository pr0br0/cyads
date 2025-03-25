// types/database.ts
import { SupabaseClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name_en: string
          name_el: string
          name_ru: string
          slug: string
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_el: string
          name_ru: string
          slug: string
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_el?: string
          name_ru?: string
          slug?: string
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name_en: string
          name_el: string
          name_ru: string
          slug: string
          coordinates: unknown // PostGIS geometry
          parent_id?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_el: string
          name_ru: string
          slug: string
          coordinates: unknown
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_el?: string
          name_ru?: string
          slug?: string
          coordinates?: unknown
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ads: {
        Row: {
          id: string
          title: string
          description: string
          price?: number | null
          currency?: string | null
          category_id: string
          location_id: string
          coordinates?: unknown | null
          user_id: string
          status: 'draft' | 'published' | 'expired' | 'sold' | 'deleted'
          is_featured: boolean
          contact_phone?: string | null
          contact_email?: string | null
          view_count: number
          created_at: string
          updated_at: string
          expires_at: string
        }
        // ... Insert and Update types would go here
      }
      // ... other tables
    }
    // ... other schema definitions
  }
}

export type TypedSupabaseClient = SupabaseClient<Database>
