
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          category: string
          created_at: string
          description: string
          featured: boolean
          id: string
          images: string[]
          location: string
          price: number
          price_unit: string
          rating: number
          status: string
          sub_category: string
          title: string
          updated_at: string
          user_id: string
          tide_dependency: string | null // Added tide dependency field
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          images?: string[]
          location?: string
          price?: number
          price_unit?: string
          rating?: number
          status?: string
          sub_category?: string
          title: string
          updated_at?: string
          user_id?: string
          tide_dependency?: string | null // Added tide dependency field
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          images?: string[]
          location?: string
          price?: number
          price_unit?: string
          rating?: number
          status?: string
          sub_category?: string
          title?: string
          updated_at?: string
          user_id?: string
          tide_dependency?: string | null // Added tide dependency field
        }
        Relationships: [
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
            referencedRelation: "operators"
            referencedColumns: ["id"]
          }
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
            referencedRelation: "operators"
            referencedColumns: ["id"]
          }
        ]
      }
      operators: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string
          contact_person_name: string
          contact_email: string
          contact_phone: string
          address_street: string | null
          address_area: string | null
          address_city: string | null
          address_country: string | null
          service_area_description: string | null
          description: string | null
          categories: string[] | null
          key_offerings: string[] | null
          logo_url: string | null
          cover_photo_url: string | null
          location_coordinates: unknown | null
          operating_hours: Json | null
          price_range: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type: string
          contact_person_name: string
          contact_email: string
          contact_phone: string
          address_street?: string | null
          address_area?: string | null
          address_city?: string | null
          address_country?: string | null
          service_area_description?: string | null
          description?: string | null
          categories?: string[] | null
          key_offerings?: string[] | null
          logo_url?: string | null
          cover_photo_url?: string | null
          location_coordinates?: unknown | null
          operating_hours?: Json | null
          price_range?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string
          contact_person_name?: string
          contact_email?: string
          contact_phone?: string
          address_street?: string | null
          address_area?: string | null
          address_city?: string | null
          address_country?: string | null
          service_area_description?: string | null
          description?: string | null
          categories?: string[] | null
          key_offerings?: string[] | null
          logo_url?: string | null
          cover_photo_url?: string | null
          location_coordinates?: unknown | null
          operating_hours?: Json | null
          price_range?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operators_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          dietary_preferences: string[] | null
          interests: string[] | null
          stay_duration: number | null
          is_tourist: boolean | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          dietary_preferences?: string[] | null
          interests?: string[] | null
          stay_duration?: number | null
          is_tourist?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          dietary_preferences?: string[] | null
          interests?: string[] | null
          stay_duration?: number | null
          is_tourist?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: number
          created_at: string
          user_id: string
          listing_id: string
          rating: number
          comment: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          listing_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          listing_id?: string
          rating?: number
          comment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Listing = Database['public']['Tables']['listings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Operator = Database['public']['Tables']['operators']['Row']

export type OperatorStatus = 'pending_verification' | 'verified' | 'rejected' | 'needs_info'

// Add enum for tide dependency
export type TideDependency = 'low_tide_only' | 'high_tide_only' | 'mid_to_high_tide' | 'any_tide' | null
