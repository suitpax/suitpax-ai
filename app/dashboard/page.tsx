"use client"

import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard"
import { BankConnectionCard } from "@/components/dashboard/bank-connection-card"
import { TopDestinationsCard } from "@/components/dashboard/top-destinations-card"
import { RadarChart } from "@/components/charts/radar-chart"
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
import { BusinessMetricsChart } from "@/components/charts/business-metrics-chart"
import { TravelEfficiencyChart } from "@/components/charts/travel-efficiency-chart"
import { MonthlySpendingChart } from "@/components/charts/monthly-spending-chart"
import { motion } from "framer-motion"
import { Calendar, CreditCard, TrendingUp, Building2, Clock, DollarSign, Plane } from "lucide-react"

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
      id: "user-profile",
      title: "User Profile",
      component: (
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          {/* Enhanced user profile card with more attractive details and plan information */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600 font-medium text-xl shadow-sm">
                  JD
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full border-3 border-white flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-medium tracking-tight text-gray-900">John Doe</h3>
                  <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                    Premium
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Senior Business Travel Manager</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Acme Corporation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Member since Jan 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Last trip: Dec 15</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Travel Score: 0/100</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">This Month</div>
              <div className="text-2xl font-medium text-gray-900 mb-1">$0</div>
              <div className="text-xs text-gray-600 mb-3">Travel Expenses</div>
              <div className="flex items-center justify-end space-x-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span className="text-xs text-gray-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Added progress bars and additional metrics */}
          <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 mb-1">0</div>
                <div className="text-xs text-gray-500">Trips Completed</div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className="bg-gray-600 h-1.5 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 mb-1">$0</div>
                <div className="text-xs text-gray-500">Total Saved</div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className="bg-gray-500 h-1.5 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 mb-1">0%</div>
                <div className="text-xs text-gray-500">Policy Compliance</div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: "0%" }}></div>
                </div>
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
      id: "travel-efficiency",
      title: "Travel Efficiency",
      component: <TravelEfficiencyChart />,
    },
    {
      id: "monthly-spending",
      title: "Monthly Spending",
      component: <MonthlySpendingChart />,
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
          {/* Updated header title format as requested */}
          <h1 className="text-3xl md:text-4xl font-medium tracking-tighter leading-none text-gray-900 mb-2">
            Dashboard - Welcome back, John
          </h1>
          <p className="text-gray-600 font-light">
            Your comprehensive business travel management overview and insights
          </p>
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
