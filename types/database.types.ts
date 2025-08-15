export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
	public: {
		Tables: {
			bank_connections: {
				Row: {
					id: string
					user_id: string
					gocardless_requisition_id: string
					institution_id: string
					institution_name: string
					institution_logo: string | null
					country_code: string
					status: "pending" | "active" | "expired" | "suspended" | "error"
					access_valid_for_days: number | null
					max_historical_days: number | null
					created_at: string
					updated_at: string
					expires_at: string | null
					last_sync_at: string | null
					error_message: string | null
				}
				Insert: {
					id?: string
					user_id: string
					gocardless_requisition_id: string
					institution_id: string
					institution_name: string
					institution_logo?: string | null
					country_code: string
					status?: "pending" | "active" | "expired" | "suspended" | "error"
					access_valid_for_days?: number | null
					max_historical_days?: number | null
					created_at?: string
					updated_at?: string
					expires_at?: string | null
					last_sync_at?: string | null
					error_message?: string | null
				}
				Update: {
					id?: string
					user_id?: string
					gocardless_requisition_id?: string
					institution_id?: string
					institution_name?: string
					institution_logo?: string | null
					country_code?: string
					status?: "pending" | "active" | "expired" | "suspended" | "error"
					access_valid_for_days?: number | null
					max_historical_days?: number | null
					created_at?: string
					updated_at?: string
					expires_at?: string | null
					last_sync_at?: string | null
					error_message?: string | null
				}
			}
			bank_accounts: {
				Row: {
					id: string
					connection_id: string
					user_id: string
					gocardless_account_id: string
					account_name: string | null
					account_holder_name: string | null
					iban: string | null
					account_number: string | null
					sort_code: string | null
					currency: string
					account_type: string | null
					status: "active" | "inactive" | "closed"
					current_balance: number | null
					available_balance: number | null
					balance_updated_at: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					connection_id: string
					user_id: string
					gocardless_account_id: string
					account_name?: string | null
					account_holder_name?: string | null
					iban?: string | null
					account_number?: string | null
					sort_code?: string | null
					currency?: string
					account_type?: string | null
					status?: "active" | "inactive" | "closed"
					current_balance?: number | null
					available_balance?: number | null
					balance_updated_at?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					connection_id?: string
					user_id?: string
					gocardless_account_id?: string
					account_name?: string | null
					account_holder_name?: string | null
					iban?: string | null
					account_number?: string | null
					sort_code?: string | null
					currency?: string
					account_type?: string | null
					status?: "active" | "inactive" | "closed"
					current_balance?: number | null
					available_balance?: number | null
					balance_updated_at?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			bank_transactions: {
				Row: {
					id: string
					account_id: string
					user_id: string
					gocardless_transaction_id: string
					amount: number
					currency: string
					transaction_date: string
					booking_date: string | null
					value_date: string | null
					merchant_name: string | null
					counterparty_name: string | null
					description: string | null
					reference: string | null
					transaction_code: string | null
					category: string | null
					auto_category: string | null
					is_business_expense: boolean | null
					expense_id: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					account_id: string
					user_id: string
					gocardless_transaction_id: string
					amount: number
					currency?: string
					transaction_date: string
					booking_date?: string | null
					value_date?: string | null
					merchant_name?: string | null
					counterparty_name?: string | null
					description?: string | null
					reference?: string | null
					transaction_code?: string | null
					category?: string | null
					auto_category?: string | null
					is_business_expense?: boolean | null
					expense_id?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					account_id?: string
					user_id?: string
					gocardless_transaction_id?: string
					amount?: number
					currency?: string
					transaction_date?: string
					booking_date?: string | null
					value_date?: string | null
					merchant_name?: string | null
					counterparty_name?: string | null
					description?: string | null
					reference?: string | null
					transaction_code?: string | null
					category?: string | null
					auto_category?: string | null
					is_business_expense?: boolean | null
					expense_id?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			bank_categorization_rules: {
				Row: {
					id: string
					user_id: string
					rule_name: string
					rule_type: "merchant" | "description" | "amount" | "reference"
					pattern: string
					category: string
					is_business_expense: boolean | null
					priority: number | null
					is_active: boolean | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					rule_name: string
					rule_type: "merchant" | "description" | "amount" | "reference"
					pattern: string
					category: string
					is_business_expense?: boolean | null
					priority?: number | null
					is_active?: boolean | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					rule_name?: string
					rule_type?: "merchant" | "description" | "amount" | "reference"
					pattern?: string
					category?: string
					is_business_expense?: boolean | null
					priority?: number | null
					is_active?: boolean | null
					created_at?: string
					updated_at?: string
				}
			}
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
					onboarding_completed?: boolean
					ai_tokens_used?: number
					ai_tokens_limit?: number
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
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
			meetings: {
				Row: {
					id: string
					user_id: string
					title: string
					type: "video" | "phone" | "in-person"
					status: "upcoming" | "completed" | "cancelled"
					starts_at: string
					ends_at: string
					duration_minutes: number
					attendees: string[] | null
					location: string | null
					description: string | null
					meeting_url: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					title: string
					type: "video" | "phone" | "in-person"
					status?: "upcoming" | "completed" | "cancelled"
					starts_at: string
					ends_at: string
					attendees?: string[] | null
					location?: string | null
					description?: string | null
					meeting_url?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					title?: string
					type?: "video" | "phone" | "in-person"
					status?: "upcoming" | "completed" | "cancelled"
					starts_at?: string
					ends_at?: string
					attendees?: string[] | null
					location?: string | null
					description?: string | null
					meeting_url?: string | null
					created_at?: string
					updated_at?: string
				}
			}
			ai_usage: {
				Row: {
					id: number
					user_id: string
					session_id: string | null
					model: string
					input_tokens: number | null
					output_tokens: number | null
					total_tokens: number | null
					cost_usd: number | null
					context_type: "general" | "flight_search" | "expense_help" | "travel_planning"
					created_at: string
				}
				Insert: {
					id?: number
					user_id: string
					session_id?: string | null
					model: string
					input_tokens?: number | null
					output_tokens?: number | null
					cost_usd?: number | null
					context_type?: "general" | "flight_search" | "expense_help" | "travel_planning"
					created_at?: string
				}
				Update: {
					id?: number
					user_id?: string
					session_id?: string | null
					model?: string
					input_tokens?: number | null
					output_tokens?: number | null
					total_tokens?: number | null
					cost_usd?: number | null
					context_type?: "general" | "flight_search" | "expense_help" | "travel_planning"
					created_at?: string
				}
			}
			web_sources: {
				Row: {
					id: number
					user_id: string | null
					href: string
					title: string | null
					description: string | null
					favicon_url: string | null
					content_snippet: string | null
					created_at: string
				}
				Insert: {
					id?: number
					user_id?: string | null
					href: string
					title?: string | null
					description?: string | null
					favicon_url?: string | null
					content_snippet?: string | null
					created_at?: string
				}
				Update: {
					id?: number
					user_id?: string | null
					href?: string
					title?: string | null
					description?: string | null
					favicon_url?: string | null
					content_snippet?: string | null
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
			chat_sessions: {
				Row: {
					id: string
					user_id: string
					title: string
					archived: boolean
					last_message_at: string
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					title?: string
					archived?: boolean
					last_message_at?: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					user_id?: string
					title?: string
					archived?: boolean
					last_message_at?: string
					created_at?: string
					updated_at?: string
				}
			}
		}
		Views: {
			users: {
				Row: {
					id: string
					first_name: string | null
					last_name: string | null
					company: string | null
					job_title: string | null
					phone: string | null
					timezone: string | null
					seat_preference: "aisle" | "window" | "middle" | "no_preference" | null
					meal_preference: string | null
					notification_settings: Json | null
					onboarding_completed: boolean | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					first_name?: string | null
					last_name?: string | null
					company?: string | null
					job_title?: string | null
					phone?: string | null
					timezone?: string | null
					seat_preference?: "aisle" | "window" | "middle" | "no_preference" | null
					meal_preference?: string | null
					notification_settings?: Json | null
					onboarding_completed?: boolean | null
				}
				Update: {
					id?: string
					first_name?: string | null
					last_name?: string | null
					company?: string | null
					job_title?: string | null
					phone?: string | null
					timezone?: string | null
					seat_preference?: "aisle" | "window" | "middle" | "no_preference" | null
					meal_preference?: string | null
					notification_settings?: Json | null
					onboarding_completed?: boolean | null
					created_at?: string
					updated_at?: string
				}
			}
			user_profiles: {
				Row: {
					user_id: string
					full_name: string | null
					company: string | null
					phone: string | null
					timezone: string | null
					preferences: Json | null
					created_at: string
					updated_at: string
				}
				Insert: {
					user_id?: string
					full_name?: string | null
					company?: string | null
					phone?: string | null
					timezone?: string | null
					preferences?: Json | null
				}
				Update: {
					user_id?: string
					full_name?: string | null
					company?: string | null
					phone?: string | null
					timezone?: string | null
					preferences?: Json | null
					created_at?: string
					updated_at?: string
				}
			}
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
