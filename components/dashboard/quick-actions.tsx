"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { PaperAirplaneIcon, PlusIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from "@heroicons/react/24/outline"

interface QuickActionsProps {
  userPlan: string
}

export default function QuickActions({ userPlan }: QuickActionsProps) {
  const actions = [
    {
      title: "Book Flight",
      description: "Search and book flights",
      href: "/dashboard/flights",
      icon: PaperAirplaneIcon,
      primary: true,
    },
    {
      title: "Add Expense",
      description: "Track your expenses",
      href: "/dashboard/expenses",
      icon: PlusIcon,
      primary: false,
    },
    {
      title: "Ask Suitpax AI",
      description: "Get travel assistance",
      href: "/dashboard/ai-chat",
      icon: ChatBubbleLeftRightIcon,
      primary: false,
    },
    {
      title: "View Analytics",
      description: "See your travel insights",
      href: "/dashboard/analytics",
      icon: ChartBarIcon,
      primary: false,
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
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group h-full"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                  action.primary ? "bg-black group-hover:bg-gray-800" : "bg-gray-200 group-hover:bg-gray-300"
                }`}
              >
                <action.icon className={`h-5 w-5 ${action.primary ? "text-white" : "text-gray-600"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
