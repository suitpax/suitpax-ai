"use client"

import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard"
import { BankConnectionCard } from "@/components/dashboard/bank-connection-card"
import { TopDestinationsCard } from "@/components/dashboard/top-destinations-card"
import { SpectacularFlightSearch } from "@/components/dashboard/spectacular-flight-search"
import { RadarChart } from "@/components/charts/radar-chart"
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
import { BusinessMetricsChart } from "@/components/charts/business-metrics-chart"
import { motion } from "framer-motion"
import { Calendar, CreditCard, TrendingUp, Building2, Clock, DollarSign, Plane, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const DashboardPage = () => {
  const getDisplayName = (user: any) => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    if (user?.email) return user.email.split("@")[0]
    return "User"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const dashboardCards = [
    {
      id: "spectacular-flight-search",
      title: "Flight Search",
      component: <SpectacularFlightSearch />,
    },
    {
      id: "user-profile",
      title: "User Profile",
      component: (
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-5">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center text-gray-700 font-semibold text-xl shadow-sm">
                  JD
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 rounded-full border-3 border-white flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-1">John Doe</h3>
                  <p className="text-sm text-gray-600 font-medium">Senior Business Travel Manager</p>
                </div>

                <div className="flex items-center flex-wrap gap-3 text-xs">
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                    <span className="text-gray-800 font-medium">Premium Plan</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Building2 className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-gray-700">Acme Corporation</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Clock className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-gray-700">Member since Jan 2024</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Link href="/dashboard/suitpax-ai">
                    <Button
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-4 py-2 text-xs font-medium"
                    >
                      <Sparkles className="h-3 w-3 mr-1.5" />
                      Ask Suitpax AI
                    </Button>
                  </Link>
                  <Badge className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-medium">
                    Travel Expert
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="bg-gray-50 rounded-xl p-4 min-w-[140px]">
                <div className="text-xs text-gray-500 mb-1 font-medium">This Month</div>
                <div className="text-2xl font-semibold text-gray-900 tracking-tight">$12,450</div>
                <div className="text-xs text-gray-600 mt-1">Travel Expenses</div>
              </div>
              <div className="flex items-center justify-end space-x-2 text-xs">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                <span className="text-gray-600">+15% vs last month</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-900">24</div>
                <div className="text-xs text-gray-600">Total Trips</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-900">8.5</div>
                <div className="text-xs text-gray-600">Avg Rating</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-900">$2.1K</div>
                <div className="text-xs text-gray-600">Saved This Year</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "kpi-stats",
      title: "KPI Statistics",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Trips",
              value: "0",
              change: "+0%",
              icon: Plane,
              color: "text-gray-600",
            },
            {
              title: "Total Spent",
              value: "$0",
              change: "+0%",
              icon: DollarSign,
              color: "text-gray-600",
            },
            {
              title: "Avg Trip Cost",
              value: "$0",
              change: "+0%",
              icon: TrendingUp,
              color: "text-gray-600",
            },
            {
              title: "Active Bookings",
              value: "0",
              change: "+0%",
              icon: Calendar,
              color: "text-gray-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl font-medium tracking-tight text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-2 rounded-xl bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: "bank-connection",
      title: "Bank Connection",
      component: <BankConnectionCard />,
    },
    {
      id: "top-destinations",
      title: "Top Destinations",
      component: <TopDestinationsCard />,
    },
    {
      id: "performance-radar",
      title: "Performance Radar",
      component: (
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium tracking-tight text-gray-900">Travel Performance</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span className="text-xs text-gray-600">Current Period</span>
            </div>
          </div>
          <RadarChart />
        </div>
      ),
    },
    {
      id: "expense-trends",
      title: "Expense Trends",
      component: <ExpenseTrendsChart />,
    },
    {
      id: "business-metrics",
      title: "Business Metrics",
      component: <BusinessMetricsChart />,
    },
    {
      id: "suitpax-ai",
      title: "Suitpax AI",
      component: (
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
                <img src="/suitpax-bl-logo.webp" alt="Suitpax AI" className="w-8 h-8 object-contain rounded-md" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium tracking-tight text-gray-900">Suitpax AI Assistant</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-xs text-gray-600 font-medium">Online</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Your intelligent travel companion is ready to help optimize your business trips, find the best deals,
                and manage your travel preferences.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Quick Actions</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Find Flights", icon: Plane },
                    { label: "Book Hotel", icon: Building2 },
                    { label: "Expense Report", icon: CreditCard },
                    { label: "Travel Insights", icon: TrendingUp },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center space-x-2 p-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                      <action.icon className="h-3 w-3" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-2">Welcome back, John</h1>
          <p className="text-gray-600 text-sm">Here's what's happening with your business travel today.</p>
        </motion.div>
      </div>

      <DraggableDashboard
        cards={dashboardCards}
        onReorder={(newOrder) => {
          console.log("Dashboard reordered:", newOrder)
        }}
      />
    </div>
  )
}

export default DashboardPage
