export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          company: string | null
          avatar_url: string | null
          subscription_tier: "free" | "pro" | "enterprise"
          ai_tokens_used: number
          ai_tokens_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          company?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro" | "enterprise"
          ai_tokens_used?: number
          ai_tokens_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          company?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro" | "enterprise"
          ai_tokens_used?: number
          ai_tokens_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      ai_chat_logs: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          section: string
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response: string
          section?: string
          tokens_used?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          section?: string
          tokens_used?: number
          created_at?: string
        }
      }
      travel_bookings: {
        Row: {
          id: string
          user_id: string
          booking_type: "flight" | "hotel" | "car" | "train"
          booking_reference: string | null
          departure_date: string | null
          return_date: string | null
          origin: string | null
          destination: string | null
          passenger_name: string | null
          total_cost: number | null
          currency: string
          status: "pending" | "confirmed" | "cancelled" | "completed"
          booking_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_type: "flight" | "hotel" | "car" | "train"
          booking_reference?: string | null
          departure_date?: string | null
          return_date?: string | null
          origin?: string | null
          destination?: string | null
          passenger_name?: string | null
          total_cost?: number | null
          currency?: string
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          booking_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_type?: "flight" | "hotel" | "car" | "train"
          booking_reference?: string | null
          departure_date?: string | null
          return_date?: string | null
          origin?: string | null
          destination?: string | null
          passenger_name?: string | null
          total_cost?: number | null
          currency?: string
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          booking_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          booking_id: string | null
          category: "flight" | "hotel" | "meals" | "transport" | "other"
          description: string
          amount: number
          currency: string
          expense_date: string
          receipt_url: string | null
          status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_id?: string | null
          category: "flight" | "hotel" | "meals" | "transport" | "other"
          description: string
          amount: number
          currency?: string
          expense_date: string
          receipt_url?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_id?: string | null
          category?: "flight" | "hotel" | "meals" | "transport" | "other"
          description?: string
          amount?: number
          currency?: string
          expense_date?: string
          receipt_url?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_airlines: string[] | null
          preferred_hotels: string[] | null
          seat_preference: string | null
          meal_preference: string | null
          notification_settings: Json
          travel_policies: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_airlines?: string[] | null
          preferred_hotels?: string[] | null
          seat_preference?: string | null
          meal_preference?: string | null
          notification_settings?: Json
          travel_policies?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_airlines?: string[] | null
          preferred_hotels?: string[] | null
          seat_preference?: string | null
          meal_preference?: string | null
          notification_settings?: Json
          travel_policies?: Json
          created_at?: string
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
