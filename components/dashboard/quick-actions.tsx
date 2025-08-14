"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { PaperAirplaneIcon, PlusIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from "@heroicons/react/24/outline"

export function QuickActions() {
  const actions = [
    {
      title: "Book Flight",
      description: "Search and book flights",
      href: "/dashboard/flights",
      icon: PaperAirplaneIcon,
      primary: true,
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      title: "Add Expense",
      description: "Track your expenses",
      href: "/dashboard/expenses",
      icon: PlusIcon,
      primary: false,
      color: "bg-green-50 text-green-700 hover:bg-green-100",
    },
    {
      title: "Ask Suitpax AI",
      description: "Get travel assistance",
      href: "/dashboard/ai-core",
      icon: ChatBubbleLeftRightIcon,
      primary: false,
      color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    },
    {
      title: "View Analytics",
      description: "See your travel insights",
      href: "/dashboard/analytics",
      icon: ChartBarIcon,
      primary: false,
      color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6"
    >
      <h2 className="text-lg font-medium tracking-tighter mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            <Link
              href={action.href}
              className={`
                flex items-center p-4 rounded-xl transition-all duration-200 group h-full
                ${action.primary 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : action.color
                }
              `}
            >
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors
                  ${action.primary 
                    ? "bg-white/20" 
                    : "bg-white"
                  }
                `}
              >
                <action.icon className={`h-5 w-5 ${action.primary ? "text-white" : ""}`} />
              </div>
              <div>
                <p className="text-sm font-medium">{action.title}</p>
                <p className={`text-xs ${action.primary ? "text-gray-300" : "text-gray-600"}`}>
                  {action.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
