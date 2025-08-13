"use client"

import { BankConnectionCard } from "@/components/dashboard/bank-connection-card"
import { TopDestinationsCard } from "@/components/dashboard/top-destinations-card"
import { RadarChart } from "@/components/charts/radar-chart"
import { ExpenseTrendsChart } from "@/components/charts/expense-trends-chart"
import { BusinessMetricsChart } from "@/components/charts/business-metrics-chart"
import { TravelEfficiencyChart } from "@/components/charts/travel-efficiency-chart"
import { MonthlySpendingChart } from "@/components/charts/monthly-spending-chart"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, Building2, Clock, DollarSign, Plane, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useUserData } from "@/hooks/use-user-data"

const DashboardPage = () => {
  const { user, profile, loading } = useUserData()

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name
    if (profile?.first_name) return profile.first_name
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const displayName = getDisplayName()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-medium leading-none text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg font-light tracking-tighter text-gray-600">Welcome back, {displayName.split(" ")[0]}</p>
          <p className="text-sm text-gray-500 font-light mt-1">
            Your comprehensive business travel management overview and insights
          </p>
        </motion.div>
      </div>

      <div className="space-y-6">
        {/* User Profile */}
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-gray-200">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-medium text-lg">
                      {getInitials(displayName)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium tracking-tight text-gray-900">{displayName}</h3>
                  <div className="inline-flex items-center rounded-md bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700">
                    {profile?.subscription_plan || "Free"}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{profile?.job_title || "Business Travel Manager"}</p>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="h-2.5 w-2.5 text-gray-500" />
                    <span className="text-gray-600">{profile?.company_name || "Your Company"}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-2.5 w-2.5 text-gray-500" />
                    <span className="text-gray-600">Member since {new Date().getFullYear()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-2.5 w-2.5 text-gray-500" />
                    <span className="text-gray-600">No trips yet</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <TrendingUp className="h-2.5 w-2.5 text-gray-500" />
                    <span className="text-gray-600">Travel Score: 0/100</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 mb-1">This Month</div>
              <div className="text-xl font-medium text-gray-900 mb-1">$0</div>
              <div className="text-[10px] text-gray-600 mb-2">Travel Expenses</div>
              <div className="flex items-center justify-end space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                <span className="text-[10px] text-gray-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-base font-medium text-gray-900 mb-1">0</div>
                <div className="text-[10px] text-gray-500">Trips Completed</div>
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                  <div className="bg-gray-600 h-1 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-base font-medium text-gray-900 mb-1">$0</div>
                <div className="text-[10px] text-gray-500">Total Saved</div>
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                  <div className="bg-gray-500 h-1 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-base font-medium text-gray-900 mb-1">0%</div>
                <div className="text-[10px] text-gray-500">Policy Compliance</div>
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                  <div className="bg-gray-400 h-1 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ title: "Total Trips", value: "0", icon: Plane }, { title: "Total Spent", value: "$0", icon: DollarSign }, { title: "Avg Trip Cost", value: "$0", icon: TrendingUp }, { title: "Active Bookings", value: "0", icon: Calendar }].map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-lg font-medium tracking-tight text-gray-900">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 mt-1">+0% from last month</p>
                </div>
                <div className="p-2 rounded-xl bg-gray-100 text-gray-600">
                  <stat.icon className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"><RadarChart /></div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"><ExpenseTrendsChart /></div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"><BusinessMetricsChart /></div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"><TravelEfficiencyChart /></div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"><MonthlySpendingChart /></div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"><TopDestinationsCard /></div>
        </div>

        {/* Next Products marketing card */}
        <Link href="/pricing" className="block group mt-6">
          <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-6 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-xl font-medium tracking-tight text-white">Suitpax Next Products</h3>
                <p className="text-sm text-white/90 mt-1">Explore upcoming modules: Cars, Trains, Meetings AI, and more</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
