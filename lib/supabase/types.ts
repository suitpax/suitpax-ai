export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          company_name: string | null
          job_title: string | null
          phone: string | null
          subscription_plan: "free" | "premium" | "enterprise"
          subscription_status: "active" | "inactive" | "cancelled" | "trialing"
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          onboarding_completed: boolean
          ai_tokens_used: number
          ai_tokens_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          job_title?: string | null
          phone?: string | null
          subscription_plan?: "free" | "premium" | "enterprise"
          subscription_status?: "active" | "inactive" | "cancelled" | "trialing"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          onboarding_completed?: boolean
          ai_tokens_used?: number
          ai_tokens_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          job_title?: string | null
          phone?: string | null
          subscription_plan?: "free" | "premium" | "enterprise"
          subscription_status?: "active" | "inactive" | "cancelled" | "trialing"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          onboarding_completed?: boolean
          ai_tokens_used?: number
          ai_tokens_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      flight_bookings: {
        Row: {
          id: string
          user_id: string
          booking_reference: string | null
          status: "pending" | "confirmed" | "cancelled" | "completed"
          departure_airport: string
          arrival_airport: string
          destination: string
          departure_date: string
          return_date: string | null
          departure_time: string | null
          arrival_time: string | null
          airline: string | null
          flight_number: string | null
          aircraft_type: string | null
          passenger_name: string | null
          passenger_email: string | null
          seat_preference: string | null
          meal_preference: string | null
          base_price: number | null
          taxes: number | null
          total_price: number | null
          currency: string
          booking_class: "economy" | "premium_economy" | "business" | "first"
          is_round_trip: boolean
          booking_source: string
          external_booking_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_reference?: string | null
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          departure_airport: string
          arrival_airport: string
          destination: string
          departure_date: string
          return_date?: string | null
          departure_time?: string | null
          arrival_time?: string | null
          airline?: string | null
          flight_number?: string | null
          aircraft_type?: string | null
          passenger_name?: string | null
          passenger_email?: string | null
          seat_preference?: string | null
          meal_preference?: string | null
          base_price?: number | null
          taxes?: number | null
          total_price?: number | null
          currency?: string
          booking_class?: "economy" | "premium_economy" | "business" | "first"
          is_round_trip?: boolean
          booking_source?: string
          external_booking_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_reference?: string | null
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          departure_airport?: string
          arrival_airport?: string
          destination?: string
          departure_date?: string
          return_date?: string | null
          departure_time?: string | null
          arrival_time?: string | null
          airline?: string | null
          flight_number?: string | null
          aircraft_type?: string | null
          passenger_name?: string | null
          passenger_email?: string | null
          seat_preference?: string | null
          meal_preference?: string | null
          base_price?: number | null
          taxes?: number | null
          total_price?: number | null
          currency?: string
          booking_class?: "economy" | "premium_economy" | "business" | "first"
          is_round_trip?: boolean
          booking_source?: string
          external_booking_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          flight_booking_id: string | null
          title: string
          description: string | null
          category: "flight" | "hotel" | "meal" | "transport" | "conference" | "other"
          amount: number
          currency: string
          status: "pending" | "approved" | "rejected" | "reimbursed"
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          receipt_url: string | null
          receipt_filename: string | null
          expense_date: string
          location: string | null
          vendor: string | null
          project_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          flight_booking_id?: string | null
          title: string
          description?: string | null
          category?: "flight" | "hotel" | "meal" | "transport" | "conference" | "other"
          amount: number
          currency?: string
          status?: "pending" | "approved" | "rejected" | "reimbursed"
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          receipt_url?: string | null
          receipt_filename?: string | null
          expense_date: string
          location?: string | null
          vendor?: string | null
          project_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          flight_booking_id?: string | null
          title?: string
          description?: string | null
          category?: "flight" | "hotel" | "meal" | "transport" | "conference" | "other"
          amount?: number
          currency?: string
          status?: "pending" | "approved" | "rejected" | "reimbursed"
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          receipt_url?: string | null
          receipt_filename?: string | null
          expense_date?: string
          location?: string | null
          vendor?: string | null
          project_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_chat_logs: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          message: string
          response: string
          model_used: string
          tokens_used: number
          response_time_ms: number | null
          context_type: "general" | "flight_search" | "expense_help" | "travel_planning"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          message: string
          response: string
          model_used?: string
          tokens_used?: number
          response_time_ms?: number | null
          context_type?: "general" | "flight_search" | "expense_help" | "travel_planning"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          message?: string
          response?: string
          model_used?: string
          tokens_used?: number
          response_time_ms?: number | null
          context_type?: "general" | "flight_search" | "expense_help" | "travel_planning"
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          preferred_airlines: string[] | null
          preferred_airports: string[] | null
          seat_preference: "aisle" | "window" | "middle" | "no_preference"
          meal_preference: string | null
          class_preference: "economy" | "premium_economy" | "business" | "first"
          email_notifications: boolean
          sms_notifications: boolean
          push_notifications: boolean
          booking_reminders: boolean
          expense_reminders: boolean
          max_flight_budget: number | null
          requires_approval_over: number | null
          allowed_booking_classes: string[] | null
          timezone: string
          currency: string
          date_format: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_airlines?: string[] | null
          preferred_airports?: string[] | null
          seat_preference?: "aisle" | "window" | "middle" | "no_preference"
          meal_preference?: string | null
          class_preference?: "economy" | "premium_economy" | "business" | "first"
          email_notifications?: boolean
          sms_notifications?: boolean
          push_notifications?: boolean
          booking_reminders?: boolean
          expense_reminders?: boolean
          max_flight_budget?: number | null
          requires_approval_over?: number | null
          allowed_booking_classes?: string[] | null
          timezone?: string
          currency?: string
          date_format?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_airlines?: string[] | null
          preferred_airports?: string[] | null
          seat_preference?: "aisle" | "window" | "middle" | "no_preference"
          meal_preference?: string | null
          class_preference?: "economy" | "premium_economy" | "business" | "first"
          email_notifications?: boolean
          sms_notifications?: boolean
          push_notifications?: boolean
          booking_reminders?: boolean
          expense_reminders?: boolean
          max_flight_budget?: number | null
          requires_approval_over?: number | null
          allowed_booking_classes?: string[] | null
          timezone?: string
          currency?: string
          date_format?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_ai_tokens: {
        Args: {
          user_id: string
          tokens: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
