export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/types"
import { cookieStore } from "@/lib/supabase/cookies"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookieStore
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get flight bookings count
    const { count: flightCount } = await supabase
      .from("flight_bookings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get expenses stats and rows for aggregation
    const { data: expenses } = await supabase
      .from("expenses")
      .select("amount, status, created_at")
      .eq("user_id", user.id)

    const totalExpenses = expenses?.length || 0
    const pendingExpenses = expenses?.filter((e) => e.status === "pending").length || 0

    // Calculate this month expenses and monthly series (last 6 months)
    const now = new Date()
    const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    const months: { key: string; label: string; amount: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = monthKey(d)
      const label = d.toLocaleString('en-US', { month: 'short' })
      const amount = (expenses || []).filter(e => {
        const ed = new Date(e.created_at)
        return monthKey(ed) === key
      }).reduce((sum, e) => sum + (e.amount || 0), 0)
      months.push({ key, label, amount })
    }

    const currentMonthKey = monthKey(now)
    const thisMonthExpenses = months.find(m => m.key === currentMonthKey)?.amount || 0

    // Get recent activities
    const { data: recentExpenses } = await supabase
      .from("expenses")
      .select("id, title, amount, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3)

    const { data: recentFlights } = await supabase
      .from("flight_bookings")
      .select("id, destination, flight_number, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(2)

    // Get upcoming trips
    const { data: upcomingTrips } = await supabase
      .from("flight_bookings")
      .select("id, destination, departure_date, return_date, status, flight_number")
      .eq("user_id", user.id)
      .gte("departure_date", new Date().toISOString())
      .order("departure_date", { ascending: true })
      .limit(5)

    // Top destinations aggregation (by count and by total amount)
    const { data: userFlights } = await supabase
      .from("flight_bookings")
      .select("destination, total_amount")
      .eq("user_id", user.id)

    const destinationMap: Record<string, { trips: number; amount: number }> = {}
    ;(userFlights || []).forEach((f) => {
      const dest = f.destination || 'N/A'
      if (!destinationMap[dest]) destinationMap[dest] = { trips: 0, amount: 0 }
      destinationMap[dest].trips += 1
      destinationMap[dest].amount += parseFloat(String(f.total_amount || 0))
    })

    const topDestinations = Object.entries(destinationMap)
      .map(([city, v]) => ({ city, trips: v.trips, amount: v.amount }))
      .sort((a, b) => b.trips - a.trips)
      .slice(0, 8)

    // Combine recent activities
    interface Activity {
      id: string;
      type: string;
      title: string;
      description: string;
      created_at: string;
      amount?: number;
    }
    
    const activities: Activity[] = []

    recentExpenses?.forEach((expense) => {
      activities.push({
        id: expense.id,
        type: "expense",
        title: expense.title || "Expense submitted",
        description: `$${expense.amount} expense`,
        created_at: expense.created_at,
        amount: expense.amount,
      })
    })

    recentFlights?.forEach((flight) => {
      activities.push({
        id: flight.id,
        type: "flight",
        title: `Flight to ${flight.destination}`,
        description: flight.flight_number ? `Flight ${flight.flight_number}` : "Flight booking",
        created_at: flight.created_at,
      })
    })

    // Sort by date and take top 5
    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({
      stats: {
        total_flights: flightCount || 0,
        total_expenses: totalExpenses,
        pending_expenses: pendingExpenses,
        this_month_expenses: thisMonthExpenses,
      },
      recent_activities: activities.slice(0, 5),
      upcoming_trips: upcomingTrips || [],
      monthly_spending: months.map(m => ({ month: m.label, amount: m.amount })),
      top_destinations: topDestinations,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
