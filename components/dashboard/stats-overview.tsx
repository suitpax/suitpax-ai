"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const stats = [
  {
    name: "Total Trips",
    value: "28",
    change: "+12%",
    changeType: "increase",
    description: "from last month",
  },
  {
    name: "Total Savings",
    value: "$12,450",
    change: "+8.2%",
    changeType: "increase",
    description: "from last month",
  },
  {
    name: "Avg. Trip Cost",
    value: "$2,340",
    change: "-3.1%",
    changeType: "decrease",
    description: "from last month",
  },
  {
    name: "Team Members",
    value: "12",
    change: "0%",
    changeType: "neutral",
    description: "no change",
  },
]

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className="flex items-center space-x-1">
              {stat.changeType === "increase" && <TrendingUp className="h-4 w-4 text-green-600" />}
              {stat.changeType === "decrease" && <TrendingDown className="h-4 w-4 text-red-600" />}
              {stat.changeType === "neutral" && <Minus className="h-4 w-4 text-gray-400" />}
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "increase"
                    ? "text-green-600"
                    : stat.changeType === "decrease"
                      ? "text-red-600"
                      : "text-gray-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
