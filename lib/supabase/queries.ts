import { createClient } from "./client"
import type { Database } from "./types"
import { cache } from "@/lib/cache/redis-cache"
import { logger } from "@/lib/logger"

type Tables = Database["public"]["Tables"]
type Profile = Tables["profiles"]["Row"]
type FlightBooking = Tables["flight_bookings"]["Row"]
type Expense = Tables["expenses"]["Row"]
type UserPreferences = Tables["user_preferences"]["Row"]

export class SupabaseQueries {
  private supabase = createClient()

  async getProfile(userId: string): Promise<Profile | null> {
    const cacheKey = cache.generateUserKey(userId, "profile")

    return cache.getOrSet(
      cacheKey,
      async () => {
        const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single()

        if (error) {
          logger.error("Error fetching profile", { userId, error: error.message })
          return null
        }

        return data
      },
      10 * 60 * 1000,
    ) // Cache for 10 minutes
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await this.supabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) {
      logger.error("Error updating profile", { userId, error: error.message })
      return null
    }

    await cache.invalidate(`user:${userId}:profile`)
    return data
  }

  async getFlightBookings(userId: string, limit = 50): Promise<FlightBooking[]> {
    const cacheKey = cache.generateUserKey(userId, "flight_bookings", { limit })

    return cache.getOrSet(
      cacheKey,
      async () => {
        const { data, error } = await this.supabase
          .from("flight_bookings")
          .select(`
          id,
          booking_reference,
          departure_date,
          arrival_date,
          departure_airport,
          arrival_airport,
          airline,
          flight_number,
          status,
          total_amount,
          currency,
          created_at
        `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(limit)

        if (error) {
          logger.error("Error fetching flight bookings", { userId, error: error.message })
          return []
        }

        return data || []
      },
      5 * 60 * 1000,
    ) // Cache for 5 minutes
  }

  async getUpcomingFlights(userId: string): Promise<FlightBooking[]> {
    const cacheKey = cache.generateUserKey(userId, "upcoming_flights")

    return cache.getOrSet(
      cacheKey,
      async () => {
        const { data, error } = await this.supabase
          .from("flight_bookings")
          .select(`
          id,
          booking_reference,
          departure_date,
          departure_airport,
          arrival_airport,
          airline,
          flight_number,
          status
        `)
          .eq("user_id", userId)
          .gte("departure_date", new Date().toISOString())
          .order("departure_date", { ascending: true })
          .limit(5)

        if (error) {
          logger.error("Error fetching upcoming flights", { userId, error: error.message })
          return []
        }

        return data || []
      },
      2 * 60 * 1000,
    ) // Cache for 2 minutes (more frequent updates for upcoming flights)
  }

  async createFlightBooking(booking: Tables["flight_bookings"]["Insert"]): Promise<FlightBooking | null> {
    const { data, error } = await this.supabase.from("flight_bookings").insert(booking).select().single()

    if (error) {
      logger.error("Error creating flight booking", { booking, error: error.message })
      return null
    }

    await cache.invalidate(`user:${booking.user_id}:flight_bookings`)
    await cache.invalidate(`user:${booking.user_id}:upcoming_flights`)
    await cache.invalidate(`user:${booking.user_id}:dashboard_stats`)

    return data
  }

  async getExpenses(userId: string, limit = 100, offset = 0): Promise<Expense[]> {
    const cacheKey = cache.generateUserKey(userId, "expenses", { limit, offset })

    return cache.getOrSet(
      cacheKey,
      async () => {
        const { data, error } = await this.supabase
          .from("expenses")
          .select(`
          id,
          amount,
          currency,
          category,
          description,
          status,
          receipt_url,
          created_at,
          expense_date
        `)
          .eq("user_id", userId)
          .order("expense_date", { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) {
          logger.error("Error fetching expenses", { userId, error: error.message })
          return []
        }

        return data || []
      },
      3 * 60 * 1000,
    ) // Cache for 3 minutes
  }

  async createExpense(expense: Tables["expenses"]["Insert"]): Promise<Expense | null> {
    const { data, error } = await this.supabase.from("expenses").insert(expense).select().single()

    if (error) {
      logger.error("Error creating expense", { expense, error: error.message })
      return null
    }

    await cache.invalidate(`user:${expense.user_id}:expenses`)
    await cache.invalidate(`user:${expense.user_id}:dashboard_stats`)

    return data
  }

  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<Expense | null> {
    const { data, error } = await this.supabase.from("expenses").update(updates).eq("id", expenseId).select().single()

    if (error) {
      logger.error("Error updating expense", { expenseId, error: error.message })
      return null
    }

    if (data?.user_id) {
      await cache.invalidate(`user:${data.user_id}:expenses`)
      await cache.invalidate(`user:${data.user_id}:dashboard_stats`)
    }

    return data
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const cacheKey = cache.generateUserKey(userId, "preferences")

    return cache.getOrSet(
      cacheKey,
      async () => {
        const { data, error } = await this.supabase.from("user_preferences").select("*").eq("user_id", userId).single()

        if (error) {
          logger.error("Error fetching user preferences", { userId, error: error.message })
          return null
        }

        return data
      },
      15 * 60 * 1000,
    ) // Cache for 15 minutes
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const { data, error } = await this.supabase
      .from("user_preferences")
      .upsert({ user_id: userId, ...preferences })
      .select()
      .single()

    if (error) {
      logger.error("Error updating user preferences", { userId, error: error.message })
      return null
    }

    await cache.invalidate(`user:${userId}:preferences`)
    return data
  }

  async getDashboardStats(userId: string) {
    const cacheKey = cache.generateUserKey(userId, "dashboard_stats")

    return cache.getOrSet(
      cacheKey,
      async () => {
        try {
          const { data, error } = await this.supabase.rpc("get_user_dashboard_stats", { user_id: userId })

          if (error) {
            logger.error("Error fetching dashboard stats", { userId, error: error.message })
            return this.getFallbackStats()
          }

          return data || this.getFallbackStats()
        } catch (error) {
          logger.error("Error in dashboard stats query", { userId, error })
          return this.getFallbackStats()
        }
      },
      2 * 60 * 1000,
    ) // Cache for 2 minutes
  }

  private getFallbackStats() {
    return {
      total_flights: 0,
      total_expenses: 0,
      pending_expenses: 0,
      this_month_expenses: 0,
    }
  }

  async batchCreateExpenses(expenses: Tables["expenses"]["Insert"][]): Promise<Expense[]> {
    const { data, error } = await this.supabase.from("expenses").insert(expenses).select()

    if (error) {
      logger.error("Error batch creating expenses", { count: expenses.length, error: error.message })
      return []
    }

    const userIds = [...new Set(expenses.map((e) => e.user_id))]
    for (const userId of userIds) {
      await cache.invalidate(`user:${userId}:expenses`)
      await cache.invalidate(`user:${userId}:dashboard_stats`)
    }

    return data || []
  }

  private aiLogBatch: Tables["ai_chat_logs"]["Insert"][] = []
  private batchTimeout: NodeJS.Timeout | null = null

  async logAIChat(log: Tables["ai_chat_logs"]["Insert"]) {
    this.aiLogBatch.push(log)

    if (this.batchTimeout) clearTimeout(this.batchTimeout)

    this.batchTimeout = setTimeout(async () => {
      if (this.aiLogBatch.length === 0) return

      const batch = [...this.aiLogBatch]
      this.aiLogBatch = []

      const { error } = await this.supabase.from("ai_chat_logs").insert(batch)

      if (error) {
        logger.error("Error batch logging AI chats", { count: batch.length, error: error.message })
      }
    }, 5000) // Batch every 5 seconds
  }

  async incrementAITokens(userId: string, tokens: number) {
    const { error } = await this.supabase.rpc("increment_ai_tokens", {
      user_id: userId,
      tokens: tokens,
    })

    if (error) {
      logger.error("Error incrementing AI tokens", { userId, tokens, error: error.message })
    }

    await cache.invalidate(`user:${userId}:dashboard_stats`)
  }
}

export const supabaseQueries = new SupabaseQueries()
