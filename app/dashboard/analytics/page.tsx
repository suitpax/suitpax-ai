"use client"

import { motion } from "framer-motion"
import {
  ChartBarIcon,
  TrendingUpIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockAnalytics = {
  totalSpent: 15420,
  totalTrips: 12,
  avgTripCost: 1285,
  topDestinations: [
    { city: "London", trips: 4, amount: 5240 },
    { city: "Tokyo", trips: 3, amount: 4180 },
    { city: "Paris", trips: 2, amount: 2890 },
    { city: "Berlin", trips: 2, amount: 2110 },
    { city: "Sydney", trips: 1, amount: 1000 },
  ],
  monthlySpending: [
    { month: "Jan", amount: 2340 },
    { month: "Feb", amount: 1890 },
    { month: "Mar", amount: 3240 },
    { month: "Apr", amount: 2890 },
    { month: "May", amount: 3560 },
    { month: "Jun", amount: 1500 },
  ],
  expenseCategories: [
    { category: "Transportation", amount: 8240, percentage: 53 },
    { category: "Accommodation", amount: 4680, percentage: 30 },
    { category: "Meals", amount: 1890, percentage: 12 },
    { category: "Other", amount: 610, percentage: 5 },
  ],
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Analytics</h1>
        <p className="text-gray-600 font-light">Insights and reports for your business travel</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-medium tracking-tighter">${mockAnalytics.totalSpent.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-500">+12% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-medium tracking-tighter">{mockAnalytics.totalTrips}</p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-500">+3 from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <PaperAirplaneIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Trip Cost</p>
                <p className="text-2xl font-medium tracking-tighter">${mockAnalytics.avgTripCost.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUpIcon className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-500">-5% from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-medium tracking-tighter">$3,560</p>
                <div className="flex items-center mt-1">
                  <CalendarIcon className="h-3 w-3 text-gray-500 mr-1" />
                  <span className="text-xs text-gray-500">June 2024</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Destinations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter">Top Destinations</h2>
              <Badge className="bg-gray-200 text-gray-700 border-gray-200">
                {mockAnalytics.topDestinations.length} cities
              </Badge>
            </div>

            <div className="space-y-4">
              {mockAnalytics.topDestinations.map((destination, index) => (
                <div key={destination.city} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{destination.city}</p>
                      <p className="text-sm text-gray-500">{destination.trips} trips</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${destination.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter">Expense Categories</h2>
              <Badge className="bg-gray-200 text-gray-700 border-gray-200">
                ${mockAnalytics.totalSpent.toLocaleString()} total
              </Badge>
            </div>

            <div className="space-y-4">
              {mockAnalytics.expenseCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <span className="text-sm text-gray-600">${category.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{category.percentage}% of total</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tighter">Monthly Spending</h2>
              <Badge className="bg-gray-200 text-gray-700 border-gray-200">Last 6 months</Badge>
            </div>

            <div className="space-y-4">
              {mockAnalytics.monthlySpending.map((month) => {
                const maxAmount = Math.max(...mockAnalytics.monthlySpending.map((m) => m.amount))
                const percentage = (month.amount / maxAmount) * 100

                return (
                  <div key={month.month} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-8 relative">
                        <div
                          className="bg-black h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-white text-sm font-medium">${month.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
