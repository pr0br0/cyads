// Generated Supabase database types
export type Database = {
  public: {
    Tables: {
      ads: {
        Row: {
          id: string
          title: string
          description: string
          price: number | null
          currency: string | null
          status: string
          is_featured: boolean
          created_at: string
          category_id: string
          location_id: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price?: number | null
          currency?: string | null
          status?: string
          is_featured?: boolean
          created_at?: string
          category_id: string
          location_id: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number | null
          currency?: string | null
          status?: string
          is_featured?: boolean
          created_at?: string
          category_id?: string
          location_id?: string
          user_id?: string
        }
      },
      categories: {
        Row: {
          id: string
          name_en: string
          name_el: string
          name_ru: string
          slug: string
          icon: string | null
          color: string | null
          parent_id: string | null
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
        }
      },
      locations: {
        Row: {
          id: string
          name_en: string
          name_el: string
          name_ru: string
          slug: string
          coordinates: unknown
          parent_id: string | null
        }
        Insert: {
          id?: string
          name_en: string
          name_el: string
          name_ru: string
          slug: string
          coordinates: unknown
          parent_id?: string | null
        }
        Update: {
          id?: string
          name_en?: string
          name_el?: string
          name_ru?: string
          slug?: string
          coordinates?: unknown
          parent_id?: string | null
        }
      },
      users: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
        }
      }
    }
  }
}
