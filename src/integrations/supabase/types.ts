export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          contact_email: string | null
          id: string
          name: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          id?: string
          name: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          id?: string
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      breeds: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_mixed: boolean | null
          name: string
          species_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_mixed?: boolean | null
          name: string
          species_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_mixed?: boolean | null
          name?: string
          species_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeds_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_aliases: {
        Row: {
          alias: string
          id: string
          ingredient_id: string | null
        }
        Insert: {
          alias: string
          id?: string
          ingredient_id?: string | null
        }
        Update: {
          alias?: string
          id?: string
          ingredient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_aliases_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          id: string
          is_controversial: boolean | null
          is_toxic: boolean | null
          name: string
          notes: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          is_controversial?: boolean | null
          is_toxic?: boolean | null
          name: string
          notes?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          is_controversial?: boolean | null
          is_toxic?: boolean | null
          name?: string
          notes?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      nutritional_analysis: {
        Row: {
          id: string
          key: string
          product_line_id: string | null
          unit: string | null
          value: number | null
        }
        Insert: {
          id?: string
          key: string
          product_line_id?: string | null
          unit?: string | null
          value?: number | null
        }
        Update: {
          id?: string
          key?: string
          product_line_id?: string | null
          unit?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutritional_analysis_product_id_fkey"
            columns: ["product_line_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          allergies: string[] | null
          breed_id: string | null
          created_at: string | null
          dietary_restrictions: string[] | null
          id: string
          name: string
          species: string | null
          species_id: string | null
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          breed_id?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          id?: string
          name: string
          species?: string | null
          species_id?: string | null
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          breed_id?: string | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          id?: string
          name?: string
          species?: string | null
          species_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      product_lines: {
        Row: {
          brand_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          target_species: string[] | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          target_species?: string[] | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          target_species?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option_values: {
        Row: {
          id: string
          product_option_id: string
          value: string
        }
        Insert: {
          id?: string
          product_option_id: string
          value: string
        }
        Update: {
          id?: string
          product_option_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey"
            columns: ["product_option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          created_at: string | null
          data_type: string | null
          id: string
          label: string | null
          name: string
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          data_type?: string | null
          id?: string
          label?: string | null
          name: string
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          data_type?: string | null
          id?: string
          label?: string | null
          name?: string
          unit?: string | null
        }
        Relationships: []
      }
      product_ratings: {
        Row: {
          factors: Json | null
          id: string
          product_line_id: string | null
          score: number | null
          updated_at: string | null
        }
        Insert: {
          factors?: Json | null
          id?: string
          product_line_id?: string | null
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          factors?: Json | null
          id?: string
          product_line_id?: string | null
          score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ratings_product_id_fkey"
            columns: ["product_line_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sources: {
        Row: {
          availability: string | null
          brand_id: string | null
          currency: string | null
          id: string
          price: number | null
          product_variant_id: string
          retailer_id: string | null
          retailer_name: string
          source_type: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          availability?: string | null
          brand_id?: string | null
          currency?: string | null
          id?: string
          price?: number | null
          product_variant_id: string
          retailer_id?: string | null
          retailer_name: string
          source_type?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          availability?: string | null
          brand_id?: string | null
          currency?: string | null
          id?: string
          price?: number | null
          product_variant_id?: string
          retailer_id?: string | null
          retailer_name?: string
          source_type?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sources_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sources_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sources_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_ingredients: {
        Row: {
          id: string
          ingredient_id: string | null
          product_variant_id: string | null
        }
        Insert: {
          id?: string
          ingredient_id?: string | null
          product_variant_id?: string | null
        }
        Update: {
          id?: string
          ingredient_id?: string | null
          product_variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variant_options: {
        Row: {
          id: string
          product_option_value_id: string
          product_variant_id: string
        }
        Insert: {
          id?: string
          product_option_value_id: string
          product_variant_id: string
        }
        Update: {
          id?: string
          product_option_value_id?: string
          product_variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_option_value_fkey"
            columns: ["product_option_value_id"]
            isOneToOne: false
            referencedRelation: "product_option_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_option_variant_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          asin: string | null
          created_at: string | null
          id: string
          image_url: string | null
          lookup_key: string | null
          name: string | null
          product_id: string | null
        }
        Insert: {
          asin?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          lookup_key?: string | null
          name?: string | null
          product_id?: string | null
        }
        Update: {
          asin?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          lookup_key?: string | null
          name?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      retailers: {
        Row: {
          contact_email: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      species: {
        Row: {
          common_aliases: string[] | null
          created_at: string | null
          id: string
          name: string
          scientific_name: string | null
        }
        Insert: {
          common_aliases?: string[] | null
          created_at?: string | null
          id?: string
          name: string
          scientific_name?: string | null
        }
        Update: {
          common_aliases?: string[] | null
          created_at?: string | null
          id?: string
          name?: string
          scientific_name?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          id: string
          product_line_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          product_line_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          product_line_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_product_id_fkey"
            columns: ["product_line_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_pantry: {
        Row: {
          added_at: string | null
          id: string
          product_line_id: string | null
          quantity: number | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_line_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          product_line_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_pantry_product_id_fkey"
            columns: ["product_line_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_pantry_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scans: {
        Row: {
          id: string
          product_variant_id: string | null
          scanned_at: string | null
          scanned_code: string | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          id?: string
          product_variant_id?: string | null
          scanned_at?: string | null
          scanned_code?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          id?: string
          product_variant_id?: string | null
          scanned_at?: string | null
          scanned_code?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_scans_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tags: {
        Row: {
          created_at: string | null
          id: string
          product_line_id: string
          tag: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_line_id: string
          tag: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_line_id?: string
          tag?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tags_product_line_id_fkey"
            columns: ["product_line_id"]
            isOneToOne: false
            referencedRelation: "product_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          preferences: Json | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          preferences?: Json | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          preferences?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
