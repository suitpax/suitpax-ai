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

    // Get expenses stats
    const { data: expenses } = await supabase
      .from("expenses")
      .select("amount, status, created_at")
      .eq("user_id", user.id)

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
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
