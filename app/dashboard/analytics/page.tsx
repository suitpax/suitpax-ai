"use client"

import { motion } from "framer-motion"
import { ChartBarIcon, TrendingUpIcon, CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    name: "Total Spend",
    value: "$24,580",
    change: "+12%",
    changeType: "increase",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Trips This Month",
    value: "8",
    change: "+3",
    changeType: "increase",
    icon: TrendingUpIcon,
  },
  {
    name: "Average Trip Cost",
    value: "$3,072",
    change: "-5%",
    changeType: "decrease",
    icon: ChartBarIcon,
  },
  {
    name: "Hours Saved",
    value: "42",
    change: "+18",
    changeType: "increase",
    icon: ClockIcon,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Analytics</h1>
        <p className="text-gray-600 font-light">Insights into your business travel patterns</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-medium tracking-tighter text-gray-900">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "increase" ? "text-gray-600" : "text-gray-500"
                    }`}
                  >
                    {stat.change} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium tracking-tighter mb-4">Monthly Spending</h3>
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Chart coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium tracking-tighter mb-4">Travel Destinations</h3>
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Chart coming soon</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
