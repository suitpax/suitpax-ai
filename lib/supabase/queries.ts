import { createClient } from "./client"
import type { Database } from "./types"

type Tables = Database["public"]["Tables"]
type Profile = Tables["profiles"]["Row"]
type FlightBooking = Tables["flight_bookings"]["Row"]
type Expense = Tables["expenses"]["Row"]
type UserPreferences = Tables["user_preferences"]["Row"]

export class SupabaseQueries {
  // Removed global client instance to ensure client is created per-request context

  // Profile queries
  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating profile:", error)
      return null
    }

    return data
  }

  // Flight booking queries
  async getFlightBookings(userId: string): Promise<FlightBooking[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching flight bookings:", error)
      return []
    }

    return data || []
  }

  async getUpcomingFlights(userId: string): Promise<FlightBooking[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("flight_bookings")
      .select("*")
      .eq("user_id", userId)
      .gte("departure_date", new Date().toISOString())
      .order("departure_date", { ascending: true })
      .limit(5)

    if (error) {
      console.error("Error fetching upcoming flights:", error)
      return []
    }

    return data || []
  }

  async createFlightBooking(booking: Tables["flight_bookings"]["Insert"]): Promise<FlightBooking | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("flight_bookings").insert(booking).select().single()

    if (error) {
      console.error("Error creating flight booking:", error)
      return null
    }

    return data
  }

  // Expense queries
  async getExpenses(userId: string): Promise<Expense[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching expenses:", error)
      return []
    }

    return data || []
  }

  async createExpense(expense: Tables["expenses"]["Insert"]): Promise<Expense | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("expenses").insert(expense).select().single()

    if (error) {
      console.error("Error creating expense:", error)
      return null
    }

    return data
  }

  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<Expense | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("expenses").update(updates).eq("id", expenseId).select().single()

    if (error) {
      console.error("Error updating expense:", error)
      return null
    }

    return data
  }

  // User preferences queries
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching user preferences:", error)
      return null
    }

    return data
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("user_preferences")
      .upsert({ user_id: userId, ...preferences })
      .select()
      .single()

    if (error) {
      console.error("Error updating user preferences:", error)
      return null
    }

    return data
  }

  // Dashboard stats
  async getDashboardStats(userId: string) {
    const supabase = createClient()
    try {
      // Get flight count
      const { count: flightCount } = await supabase
        .from("flight_bookings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // Get expenses
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount, status, created_at")
        .eq("user_id", userId)

      const totalExpenses = expenses?.length || 0
      const pendingExpenses = expenses?.filter((e) => e.status === "pending").length || 0

      // Calculate this month expenses
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const thisMonthExpenses =
        expenses
          ?.filter((e) => {
            const expenseDate = new Date(e.created_at)
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
          })
          .reduce((sum, e) => sum + (e.amount || 0), 0) || 0

      return {
        total_flights: flightCount || 0,
        total_expenses: totalExpenses,
        pending_expenses: pendingExpenses,
        this_month_expenses: thisMonthExpenses,
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      return {
        total_flights: 0,
        total_expenses: 0,
        pending_expenses: 0,
        this_month_expenses: 0,
      }
    }
  }

  // AI Chat logs
  async logAIChat(log: Tables["ai_chat_logs"]["Insert"]) {
    const supabase = createClient()
    const { error } = await supabase.from("ai_chat_logs").insert(log)

    if (error) {
      console.error("Error logging AI chat:", error)
    }
  }

  async incrementAITokens(userId: string, tokens: number) {
    const supabase = createClient()
    const { error } = await supabase.rpc("increment_ai_tokens", {
      user_id: userId,
      tokens: tokens,
    })

    if (error) {
      console.error("Error incrementing AI tokens:", error)
    }
  }
}

// Removed global exported instance to avoid any accidental client creation at import time
