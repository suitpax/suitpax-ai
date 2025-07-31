"use client"

import { motion } from "framer-motion"
import { ChartBarIcon, TrendingUpIcon, CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Analytics</h1>
        <p className="text-gray-600 font-light">
          <em className="font-serif italic">Insights and reports for your travel data</em>
        </p>
      </motion.div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/50 backdrop-blur-sm p-12 rounded-2xl border border-gray-200 shadow-sm text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ChartBarIcon className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-medium tracking-tighter mb-4">Advanced Analytics Coming Soon</h2>
        <p className="text-gray-600 font-light max-w-md mx-auto mb-8">
          <em className="font-serif italic">
            We're building powerful analytics tools to help you understand your travel patterns, optimize spending, and
            make data-driven decisions.
          </em>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="p-4 bg-white/50 rounded-xl border border-gray-200">
            <TrendingUpIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium tracking-tight mb-2">Spending Trends</h3>
            <p className="text-sm text-gray-600 font-light">
              <em className="font-serif italic">Track your expenses over time</em>
            </p>
          </div>

          <div className="p-4 bg-white/50 rounded-xl border border-gray-200">
            <CalendarIcon className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium tracking-tight mb-2">Travel Patterns</h3>
            <p className="text-sm text-gray-600 font-light">
              <em className="font-serif italic">Analyze your travel frequency</em>
            </p>
          </div>

          <div className="p-4 bg-white/50 rounded-xl border border-gray-200">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium tracking-tight mb-2">Cost Optimization</h3>
            <p className="text-sm text-gray-600 font-light">
              <em className="font-serif italic">Find savings opportunities</em>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
