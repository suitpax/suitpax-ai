"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Plane, DollarSign, Clock, Users } from "lucide-react"

interface StatCard {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  description?: string
}

interface StatsOverviewProps {
  userPlan: string
  tokensUsed: number
  tokensLimit: number
  travelSearches: number
}

export function StatsOverview({ userPlan, tokensUsed, tokensLimit, travelSearches }: StatsOverviewProps) {
  const tokenUsagePercentage = (tokensUsed / tokensLimit) * 100

  const stats: StatCard[] = [
    {
      title: "AI Tokens Used",
      value: `${tokensUsed.toLocaleString()}`,
      change: `${tokenUsagePercentage.toFixed(1)}% of limit`,
      changeType: tokenUsagePercentage > 80 ? "negative" : "neutral",
      icon: <Clock className="h-4 w-4" />,
      description: `${tokensLimit.toLocaleString()} total available`,
    },
    {
      title: "Travel Searches",
      value: travelSearches.toString(),
      change: "+12% from last month",
      changeType: "positive",
      icon: <Plane className="h-4 w-4" />,
    },
    {
      title: "Cost Savings",
      value: "$2,450",
      change: "+8% from last month",
      changeType: "positive",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Team Members",
      value: "1",
      change: "Invite more team members",
      changeType: "neutral",
      icon: <Users className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="text-gray-500">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              {stat.changeType === "positive" && <TrendingUp className="h-3 w-3 text-green-600" />}
              {stat.changeType === "negative" && <TrendingDown className="h-3 w-3 text-red-600" />}
              <span>{stat.change}</span>
            </div>
            {stat.description && <p className="text-xs text-gray-500 mt-1">{stat.description}</p>}
            {stat.title === "AI Tokens Used" && (
              <div className="mt-2">
                <Progress value={tokenUsagePercentage} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
