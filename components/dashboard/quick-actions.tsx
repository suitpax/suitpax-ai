"use client"

import { motion } from "framer-motion"
import { Plane, MessageSquare, CreditCard, Calendar, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    name: "Book Flight",
    description: "Find and book your next flight",
    href: "/dashboard/flights",
    icon: Plane,
    color: "bg-blue-500",
  },
  {
    name: "AI Chat",
    description: "Get travel assistance from AI",
    href: "/dashboard/ai-chat",
    icon: MessageSquare,
    color: "bg-green-500",
  },
  {
    name: "Submit Expense",
    description: "Upload and track expenses",
    href: "/dashboard/expenses",
    icon: CreditCard,
    color: "bg-purple-500",
  },
  {
    name: "Schedule Meeting",
    description: "Plan team travel meetings",
    href: "/dashboard/calendar",
    icon: Calendar,
    color: "bg-orange-500",
  },
  {
    name: "Manage Team",
    description: "Add or remove team members",
    href: "/dashboard/team",
    icon: Users,
    color: "bg-pink-500",
  },
  {
    name: "View Analytics",
    description: "Track travel spending and trends",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "bg-indigo-500",
  },
]

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
    >
      <h3 className="text-lg font-medium tracking-tighter text-gray-900 mb-4">
        <em className="font-serif italic">Quick Actions</em>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link
              href={action.href}
              className="group flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900 text-center">{action.name}</p>
              <p className="text-xs text-gray-500 text-center mt-1">{action.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
