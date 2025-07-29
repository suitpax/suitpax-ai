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
          plan_type: string
          ai_tokens_used: number
          ai_tokens_limit: number
          travel_searches_used: number
          travel_searches_limit: number
          team_members_count: number
          team_members_limit: number
          has_ai_expense_management: boolean
          has_custom_policies: boolean
          has_priority_support: boolean
          has_bank_integration: boolean
          has_crm_integration: boolean
          onboarding_completed: boolean
          travel_preferences: Json
          created_at: string
          updated_at: string
          plan_updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          plan_type?: string
          ai_tokens_used?: number
          ai_tokens_limit?: number
          travel_searches_used?: number
          travel_searches_limit?: number
          team_members_count?: number
          team_members_limit?: number
          has_ai_expense_management?: boolean
          has_custom_policies?: boolean
          has_priority_support?: boolean
          has_bank_integration?: boolean
          has_crm_integration?: boolean
          onboarding_completed?: boolean
          travel_preferences?: Json
          created_at?: string
          updated_at?: string
          plan_updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          plan_type?: string
          ai_tokens_used?: number
          ai_tokens_limit?: number
          travel_searches_used?: number
          travel_searches_limit?: number
          team_members_count?: number
          team_members_limit?: number
          has_ai_expense_management?: boolean
          has_custom_policies?: boolean
          has_priority_support?: boolean
          has_bank_integration?: boolean
          has_crm_integration?: boolean
          onboarding_completed?: boolean
          travel_preferences?: Json
          created_at?: string
          updated_at?: string
          plan_updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          title: string
          messages: Json
          tokens_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          title: string
          messages?: Json
          tokens_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          title?: string
          messages?: Json
          tokens_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      travel_bookings: {
        Row: {
          id: string
          user_id: string
          type: string
          booking_data: Json
          total_amount: number | null
          currency: string
          status: string
          booking_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          booking_data: Json
          total_amount?: number | null
          currency?: string
          status?: string
          booking_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          booking_data?: Json
          total_amount?: number | null
          currency?: string
          status?: string
          booking_reference?: string | null
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
