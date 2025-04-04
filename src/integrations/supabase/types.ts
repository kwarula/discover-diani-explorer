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
          created_at: string
          dietary_preferences: string[] | null
          full_name: string | null
          id: string
          interests: string[] | null
          stay_duration: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          dietary_preferences?: string[] | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          stay_duration?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          dietary_preferences?: string[] | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          stay_duration?: number | null
          updated_at?: string
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      flagged_content_type: "Review" | "Comment" | "Listing" | "OperatorProfile"
      moderation_status: "Pending" | "Resolved" | "Dismissed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
