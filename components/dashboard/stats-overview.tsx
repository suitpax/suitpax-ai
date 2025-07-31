"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PaperAirplaneIcon, CreditCardIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"

interface StatsOverviewProps {
  userPlan: string
}

interface UserStats {
  total_flights: number
  total_expenses: number
  pending_expenses: number
  this_month_expenses: number
}

export default function StatsOverview({ userPlan }: StatsOverviewProps) {
  const [stats, setStats] = useState<UserStats>({
    total_flights: 0,
    total_expenses: 0,
    pending_expenses: 0,
    this_month_expenses: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

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

        setStats({
          total_flights: flightCount || 0,
          total_expenses: totalExpenses,
          pending_expenses: pendingExpenses,
          this_month_expenses: thisMonthExpenses,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Flights",
      value: stats.total_flights,
      icon: PaperAirplaneIcon,
      description: "Flights booked",
    },
    {
      title: "Total Expenses",
      value: stats.total_expenses,
      icon: CreditCardIcon,
      description: "Expense reports",
    },
    {
      title: "Pending",
      value: stats.pending_expenses,
      icon: ClockIcon,
      description: "Awaiting approval",
    },
    {
      title: "This Month",
      value: `$${stats.this_month_expenses.toFixed(0)}`,
      icon: ChartBarIcon,
      description: "Monthly spending",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-medium tracking-tighter text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
