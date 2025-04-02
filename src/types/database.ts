export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          location: string | null
          price: number | null
          price_unit: string | null
          rating: number | null
          status: string | null
          sub_category: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string | null
          price?: number | null
          price_unit?: string | null
          rating?: number | null
          status?: string | null
          sub_category?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string | null
          price?: number | null
          price_unit?: string | null
          rating?: number | null
          status?: string | null
          sub_category?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
      }
      operators: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          dietary_preferences: string[] | null
          full_name: string | null
          id: string
          interests: string[] | null
          stay_duration: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          stay_duration?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          stay_duration?: number | null
          updated_at?: string
        }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & { row: any })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: any
    }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName]["Row"]
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & {
      row: any
    })
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Row: any
      }
      ? Database["public"]["Tables"][PublicTableNameOrOptions]["Row"]
      : never
    : never

// Define a proper union type for operator status to fix TS errors
export type OperatorStatus = 'pending_verification' | 'verified' | 'rejected' | 'needs_info';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  avatar_url?: string;
  stay_duration: number | null;
  interests: string[] | null;
  dietary_preferences?: string[] | null;
}

export interface Listing {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  price: number;
  price_unit: string;
  location: string;
  category: string;
  sub_category: string;
  images: string[];
  featured: boolean;
  status: string;
  user_id: string;
  rating?: number;
}
