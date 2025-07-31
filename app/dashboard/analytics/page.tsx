"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-medium tracking-tighter text-black leading-none">Analytics & Reports</h1>
          <p className="text-gray-600 font-light mt-1">Insights into your business travel patterns and spending</p>
        </div>
      </motion.div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-medium tracking-tighter text-gray-900 mb-4">Analytics Coming Soon</h2>
        <p className="text-gray-600 font-light max-w-md mx-auto">
          We're building powerful analytics tools to help you understand your travel patterns, optimize spending, and
          make data-driven decisions.
        </p>
      </motion.div>
    </div>
  )
}
