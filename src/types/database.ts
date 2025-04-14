export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          attendees: number | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          location: string | null
          organizer: string | null
          price: string | null
          start_date: string
          title: string
          website: string | null
        }
        Insert: {
          attendees?: number | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          organizer?: string | null
          price?: string | null
          start_date: string
          title: string
          website?: string | null
        }
        Update: {
          attendees?: number | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          organizer?: string | null
          price?: string | null
          start_date?: string
          title?: string
          website?: string | null
        }
        Relationships: []
      }
      flagged_content: {
        Row: {
          content_id: string
          content_snippet: string | null
          content_type: Database["public"]["Enums"]["flagged_content_type"]
          id: string
          moderator_notes: string | null
          reason: string | null
          reported_at: string
          reported_by_user_id: string | null
          resolved_at: string | null
          resolved_by_user_id: string | null
          status: Database["public"]["Enums"]["moderation_status"]
        }
        Insert: {
          content_id: string
          content_snippet?: string | null
          content_type: Database["public"]["Enums"]["flagged_content_type"]
          id?: string
          moderator_notes?: string | null
          reason?: string | null
          reported_at?: string
          reported_by_user_id?: string | null
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          status?: Database["public"]["Enums"]["moderation_status"]
        }
        Update: {
          content_id?: string
          content_snippet?: string | null
          content_type?: Database["public"]["Enums"]["flagged_content_type"]
          id?: string
          moderator_notes?: string | null
          reason?: string | null
          reported_at?: string
          reported_by_user_id?: string | null
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          status?: Database["public"]["Enums"]["moderation_status"]
        }
        Relationships: []
      }
      listings: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean
          guide_recommended: boolean | null
          id: string
          images: string[] | null
          is_verified: boolean | null
          location: string | null
          price: number | null
          price_range: string | null
          price_unit: string | null
          status: string
          sub_category: string | null
          tide_dependency: string | null
          title: string
          transport_instructions: string | null
          updated_at: string
          user_id: string | null
          wildlife_notice: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          guide_recommended?: boolean | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          location?: string | null
          price?: number | null
          price_range?: string | null
          price_unit?: string | null
          status?: string
          sub_category?: string | null
          tide_dependency?: string | null
          title: string
          transport_instructions?: string | null
          updated_at?: string
          user_id?: string | null
          wildlife_notice?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          guide_recommended?: boolean | null
          id?: string
          images?: string[] | null
          is_verified?: boolean | null
          location?: string | null
          price?: number | null
          price_range?: string | null
          price_unit?: string | null
          status?: string
          sub_category?: string | null
          tide_dependency?: string | null
          title?: string
          transport_instructions?: string | null
          updated_at?: string
          user_id?: string | null
          wildlife_notice?: string | null
        }
        Relationships: []
      }
      operator_gallery_media: {
        Row: {
          id: string
          media_type: string
          media_url: string
          operator_id: string
          sort_order: number | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          media_type: string
          media_url: string
          operator_id: string
          sort_order?: number | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          media_type?: string
          media_url?: string
          operator_id?: string
          sort_order?: number | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_gallery_media_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_verification_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          operator_id: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          operator_id: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          operator_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_verification_documents_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          address_area: string | null
          address_city: string | null
          address_country: string | null
          address_street: string | null
          business_name: string
          business_type: string
          categories: string[] | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          cover_photo_url: string | null
          created_at: string
          description: string | null
          id: string
          is_verified: boolean | null
          key_offerings: string[] | null
          location_coordinates: unknown | null
          logo_url: string | null
          operating_hours: Json | null
          price_range: string | null
          service_area_description: string | null
          specialties: string[] | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_area?: string | null
          address_city?: string | null
          address_country?: string | null
          address_street?: string | null
          business_name: string
          business_type: string
          categories?: string[] | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          key_offerings?: string[] | null
          location_coordinates?: unknown | null
          logo_url?: string | null
          operating_hours?: Json | null
          price_range?: string | null
          service_area_description?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_area?: string | null
          address_city?: string | null
          address_country?: string | null
          address_street?: string | null
          business_name?: string
          business_type?: string
          categories?: string[] | null
          contact_email?: string
          contact_person_name?: string
          contact_phone?: string
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          key_offerings?: string[] | null
          location_coordinates?: unknown | null
          logo_url?: string | null
          operating_hours?: Json | null
          price_range?: string | null
          service_area_description?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      points_of_interest: {
        Row: {
          access_notes: string | null
          best_visit_time: string | null
          category: string
          created_at: string
          description: string
          entrance_fee: string | null
          featured: boolean | null
          guide_required: boolean | null
          history: string | null
          id: string
          image_urls: string[] | null
          images: string[] | null
          latitude: number
          longitude: number
          name: string
          significance: string | null
          updated_at: string
        }
        Insert: {
          access_notes?: string | null
          best_visit_time?: string | null
          category: string
          created_at?: string
          description: string
          entrance_fee?: string | null
          featured?: boolean | null
          guide_required?: boolean | null
          history?: string | null
          id?: string
          image_urls?: string[] | null
          images?: string[] | null
          latitude: number
          longitude: number
          name: string
          significance?: string | null
          updated_at?: string
        }
        Update: {
          access_notes?: string | null
          best_visit_time?: string | null
          category?: string
          created_at?: string
          description?: string
          entrance_fee?: string | null
          featured?: boolean | null
          guide_required?: boolean | null
          history?: string | null
          id?: string
          image_urls?: string[] | null
          images?: string[] | null
          latitude?: number
          longitude?: number
          name?: string
          significance?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          dietary_preferences: string[] | null
          full_name: string | null
          id: string
          interests: string[] | null
          is_tourist: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          stay_duration: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          is_tourist?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          stay_duration?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          is_tourist?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          stay_duration?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          listing_id: string
          operator_id: string | null
          rating: number
          used_guide: boolean | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          listing_id: string
          operator_id?: string | null
          rating: number
          used_guide?: boolean | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          listing_id?: string
          operator_id?: string | null
          rating?: number
          used_guide?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings_with_operator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      listings_with_operator: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          guide_recommended: boolean | null
          id: string | null
          images: string[] | null
          is_verified: boolean | null
          location: string | null
          operator_name: string | null
          price: number | null
          price_range: string | null
          price_unit: string | null
          status: string | null
          sub_category: string | null
          tide_dependency: string | null
          title: string | null
          transport_instructions: string | null
          updated_at: string | null
          user_id: string | null
          wildlife_notice: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      exec_sql: {
        Args: { query: string }
        Returns: undefined
      }
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          full_name: string
          email: string
          role: string
          status: string
          created_at: string
        }[]
      }
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_operator_growth_timeseries: {
        Args: { start_date: string; end_date: string }
        Returns: {
          day: string
          count: number
        }[]
      }
      get_operator_name: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_signups_timeseries: {
        Args: { start_date: string; end_date: string }
        Returns: {
          day: string
          count: number
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      flagged_content_type: "Review" | "Comment" | "Listing" | "OperatorProfile"
      moderation_status: "Pending" | "Resolved" | "Dismissed"
      user_role: "user" | "admin" | "moderator"
      user_status: "active" | "suspended" | "banned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      flagged_content_type: ["Review", "Comment", "Listing", "OperatorProfile"],
      moderation_status: ["Pending", "Resolved", "Dismissed"],
      user_role: ["user", "admin", "moderator"],
      user_status: ["active", "suspended", "banned"],
    },
  },
} as const
