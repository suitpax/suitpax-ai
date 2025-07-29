export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          company_domain: string | null
          job_title: string | null
          phone: string | null
          plan_type: string
          ai_tokens_used: number
          ai_tokens_limit: number
          travel_searches_used: number
          travel_searches_limit: number
          onboarding_completed: boolean
          travel_preferences: string | null
          preferred_airline: string | null
          preferred_hotel_chain: string | null
          dietary_restrictions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          company_domain?: string | null
          job_title?: string | null
          phone?: string | null
          plan_type?: string
          ai_tokens_used?: number
          ai_tokens_limit?: number
          travel_searches_used?: number
          travel_searches_limit?: number
          onboarding_completed?: boolean
          travel_preferences?: string | null
          preferred_airline?: string | null
          preferred_hotel_chain?: string | null
          dietary_restrictions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          company_domain?: string | null
          job_title?: string | null
          phone?: string | null
          plan_type?: string
          ai_tokens_used?: number
          ai_tokens_limit?: number
          travel_searches_used?: number
          travel_searches_limit?: number
          onboarding_completed?: boolean
          travel_preferences?: string | null
          preferred_airline?: string | null
          preferred_hotel_chain?: string | null
          dietary_restrictions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          messages: Json
          tokens_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          messages: Json
          tokens_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          messages?: Json
          tokens_used?: number
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
