"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plane, CreditCard, TrendingUp, Calendar, DollarSign, Building2, ArrowUpRight } from "lucide-react"

interface DashboardStats {
  totalTrips: number
  totalSpent: number
  upcomingTrips: number
  teamMembers: number
  savingsThisMonth: number
  expenseReports: number
}

interface DashboardOverviewV2Props {
  stats?: DashboardStats
}

export default function DashboardOverviewV2({
  stats = {
    totalTrips: 24,
    totalSpent: 45280,
    upcomingTrips: 3,
    teamMembers: 12,
    savingsThisMonth: 8420,
    expenseReports: 7,
  },
}: DashboardOverviewV2Props) {
  const quickActions = [
    { icon: Plane, label: "Book Flight", href: "/dashboard/flights" },
    { icon: Building2, label: "Find Hotel", href: "/dashboard/hotels" },
    { icon: Calendar, label: "Schedule Meeting", href: "/dashboard/meetings" },
    { icon: CreditCard, label: "Submit Expense", href: "/dashboard/expenses" },
  ]

  const recentActivity = [
    { type: "flight", description: "Flight to NYC booked", time: "2 hours ago", status: "confirmed" },
    { type: "expense", description: "Hotel expense submitted", time: "5 hours ago", status: "pending" },
    { type: "meeting", description: "Client meeting scheduled", time: "1 day ago", status: "confirmed" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Trips</CardTitle>
            <Plane className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{stats.totalTrips}</div>
            <p className="text-xs text-gray-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">${stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-600">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Upcoming Trips</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">{stats.upcomingTrips}</div>
            <p className="text-xs text-gray-600">Next: NYC in 5 days</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-gray-900">${stats.savingsThisMonth.toLocaleString()}</div>
            <p className="text-xs text-gray-600">15% below budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600">Common business travel tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-20 flex-col gap-2 bg-white/50 hover:bg-white/80 border-gray-200 rounded-xl"
                asChild
              >
                <a href={action.href}>
                  <action.icon className="h-6 w-6 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Budget Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600">Your latest travel activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
                <Badge variant={activity.status === "confirmed" ? "default" : "secondary"} className="text-xs">
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">Budget Overview</CardTitle>
            <CardDescription className="text-gray-600">Monthly spending vs budget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Travel Budget</span>
                <span className="font-medium text-gray-900">$52,000 / $60,000</span>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-gray-600">87% of monthly budget used</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expense Reports</span>
                <span className="font-medium text-gray-900">{stats.expenseReports} pending</span>
              </div>
              <Progress value={30} className="h-2" />
              <p className="text-xs text-gray-600">3 reports need approval</p>
            </div>

            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              View Detailed Reports
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
