"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Plane, DollarSign, Calendar, Users, MapPin, Clock } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  description: string
}

function StatCard({ title, value, change, changeType, icon, description }: StatCardProps) {
  const changeColor = {
    positive: "text-emerald-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }

  const changeBg = {
    positive: "bg-emerald-50",
    negative: "bg-red-50",
    neutral: "bg-gray-50",
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gray-100">{icon}</div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>

            <div className="mb-3">
              <p className="text-3xl font-medium tracking-tighter text-black mb-1">{value}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium ${changeBg[changeType]} ${changeColor[changeType]} border-0`}
              >
                {changeType === "positive" && <TrendingUp className="w-3 h-3 mr-1" />}
                {changeType === "negative" && <TrendingDown className="w-3 h-3 mr-1" />}
                {change}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function EnhancedStatsOverview() {
  const stats = [
    {
      title: "Total Trips",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: <Plane className="w-5 h-5 text-gray-700" />,
      description: "This month",
    },
    {
      title: "Travel Spend",
      value: "$12,450",
      change: "-8%",
      changeType: "positive" as const,
      icon: <DollarSign className="w-5 h-5 text-gray-700" />,
      description: "Under budget",
    },
    {
      title: "Upcoming Trips",
      value: "6",
      change: "+3",
      changeType: "neutral" as const,
      icon: <Calendar className="w-5 h-5 text-gray-700" />,
      description: "Next 30 days",
    },
    {
      title: "Team Members",
      value: "18",
      change: "+2",
      changeType: "positive" as const,
      icon: <Users className="w-5 h-5 text-gray-700" />,
      description: "Active travelers",
    },
    {
      title: "Destinations",
      value: "12",
      change: "+4",
      changeType: "positive" as const,
      icon: <MapPin className="w-5 h-5 text-gray-700" />,
      description: "Cities visited",
    },
    {
      title: "Avg Trip Time",
      value: "3.2 days",
      change: "-0.5",
      changeType: "positive" as const,
      icon: <Clock className="w-5 h-5 text-gray-700" />,
      description: "More efficient",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tighter text-black">Travel Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Your business travel insights at a glance</p>
        </div>

        <Badge className="inline-flex items-center rounded-xl bg-emerald-950 px-3 py-1 text-xs font-medium text-white">
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
