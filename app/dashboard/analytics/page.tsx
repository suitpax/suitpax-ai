"use client"

import { motion } from "framer-motion"
import {
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockAnalytics = {
  totalSpent: 15420,
  totalTrips: 12,
  avgTripCost: 1285,
  monthlyChange: 12,
  topDestinations: [
    { city: "London", trips: 4, amount: 5240, change: 15 },
    { city: "Tokyo", trips: 3, amount: 4180, change: -8 },
    { city: "Paris", trips: 2, amount: 2890, change: 22 },
    { city: "Berlin", trips: 2, amount: 2110, change: 5 },
    { city: "Sydney", trips: 1, amount: 1000, change: 0 },
  ],
  monthlySpending: [
    { month: "Jan", amount: 2340, change: 5 },
    { month: "Feb", amount: 1890, change: -12 },
    { month: "Mar", amount: 3240, change: 18 },
    { month: "Apr", amount: 2890, change: -8 },
    { month: "May", amount: 3560, change: 25 },
    { month: "Jun", amount: 1500, change: -15 },
  ],
  expenseCategories: [
    { category: "Transportation", amount: 8240, percentage: 53, change: 8 },
    { category: "Accommodation", amount: 4680, percentage: 30, change: 15 },
    { category: "Meals", amount: 1890, percentage: 12, change: -5 },
    { category: "Other", amount: 610, percentage: 5, change: 2 },
  ],
  teamMetrics: {
    activeUsers: 24,
    avgExpensePerUser: 642,
    topSpender: "Sarah Johnson",
    topSpenderAmount: 2340,
  },
}

export default function AnalyticsPage() {
  const currentMonth = mockAnalytics.monthlySpending[mockAnalytics.monthlySpending.length - 1]

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Analytics</h1>
            <p className="text-gray-600 font-light">Insights and reports for your business travel</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              Date Range
            </Button>
          </div>
        </div>
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
                  <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{mockAnalytics.monthlyChange}% from last month</span>
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
                  <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+3 from last month</span>
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
                  <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">-5% from last month</span>
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
                <p className="text-2xl font-medium tracking-tighter">${currentMonth.amount.toLocaleString()}</p>
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

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Top Destinations */}
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
                    <div className="flex items-center">
                      {destination.change > 0 ? (
                        <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                      ) : destination.change < 0 ? (
                        <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                      ) : null}
                      <span
                        className={`text-xs ${
                          destination.change > 0
                            ? "text-green-600"
                            : destination.change < 0
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {destination.change !== 0
                          ? `${destination.change > 0 ? "+" : ""}${destination.change}%`
                          : "No change"}
                      </span>
                    </div>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">${category.amount.toLocaleString()}</span>
                      <div className="flex items-center">
                        {category.change > 0 ? (
                          <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                        ) : category.change < 0 ? (
                          <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                        ) : null}
                        <span
                          className={`text-xs ${
                            category.change > 0
                              ? "text-green-600"
                              : category.change < 0
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {category.change !== 0 ? `${category.change > 0 ? "+" : ""}${category.change}%` : "0%"}
                        </span>
                      </div>
                    </div>
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
              <h2 className="text-xl font-medium tracking-tighter">Monthly Spending Trend</h2>
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
                    <div className="flex items-center w-16">
                      {month.change > 0 ? (
                        <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                      ) : month.change < 0 ? (
                        <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
                      ) : null}
                      <span
                        className={`text-xs ${
                          month.change > 0 ? "text-green-600" : month.change < 0 ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {month.change !== 0 ? `${month.change > 0 ? "+" : ""}${month.change}%` : "0%"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Team Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Active Users</p>
              <p className="text-3xl font-medium tracking-tighter">{mockAnalytics.teamMetrics.activeUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Team members</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Avg per User</p>
              <p className="text-3xl font-medium tracking-tighter">${mockAnalytics.teamMetrics.avgExpensePerUser}</p>
              <p className="text-xs text-gray-500 mt-1">Monthly average</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm md:col-span-2">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Top Spender</p>
              <p className="text-xl font-medium tracking-tighter">{mockAnalytics.teamMetrics.topSpender}</p>
              <p className="text-lg font-medium text-gray-900">
                ${mockAnalytics.teamMetrics.topSpenderAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
