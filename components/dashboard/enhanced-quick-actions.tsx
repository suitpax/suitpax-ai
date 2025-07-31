"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Hotel, Car, CreditCard, Calendar, MessageSquare, Plus, Zap } from "lucide-react"

interface QuickActionProps {
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  badge?: string
  featured?: boolean
}

function QuickActionCard({ title, description, icon, action, badge, featured }: QuickActionProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
      <Card
        className={`
          p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-lg
          ${
            featured
              ? "bg-emerald-950 text-white border-emerald-900 shadow-md"
              : "bg-white/50 backdrop-blur-sm border-gray-200 hover:border-gray-300"
          }
        `}
        onClick={action}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${featured ? "bg-emerald-900" : "bg-gray-100"}`}>{icon}</div>
          {badge && (
            <Badge
              className={`
              inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium
              ${featured ? "bg-emerald-900 text-emerald-100" : "bg-gray-200 text-gray-700"}
            `}
            >
              {badge}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className={`font-medium tracking-tighter ${featured ? "text-white" : "text-black"}`}>{title}</h3>
          <p className={`text-sm ${featured ? "text-emerald-100" : "text-gray-600"}`}>{description}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200/20">
          <div className="flex items-center gap-2">
            <Plus className={`w-4 h-4 ${featured ? "text-emerald-200" : "text-gray-500"}`} />
            <span className={`text-xs font-medium ${featured ? "text-emerald-200" : "text-gray-500"}`}>
              Quick Action
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function EnhancedQuickActions() {
  const quickActions = [
    {
      title: "Book Flight",
      description: "Find and book your next business flight with AI assistance",
      icon: <Plane className="w-6 h-6 text-emerald-100" />,
      action: () => console.log("Book flight"),
      badge: "AI Powered",
      featured: true,
    },
    {
      title: "Find Hotels",
      description: "Discover and reserve accommodations for your trip",
      icon: <Hotel className="w-6 h-6 text-gray-700" />,
      action: () => console.log("Find hotels"),
      badge: "Popular",
    },
    {
      title: "Rent Car",
      description: "Book rental cars and ground transportation",
      icon: <Car className="w-6 h-6 text-gray-700" />,
      action: () => console.log("Rent car"),
    },
    {
      title: "Submit Expense",
      description: "Upload receipts and manage travel expenses",
      icon: <CreditCard className="w-6 h-6 text-gray-700" />,
      action: () => console.log("Submit expense"),
      badge: "New",
    },
    {
      title: "Schedule Meeting",
      description: "Plan meetings around your travel schedule",
      icon: <Calendar className="w-6 h-6 text-gray-700" />,
      action: () => console.log("Schedule meeting"),
    },
    {
      title: "Ask Suitpax AI",
      description: "Get instant travel advice from our AI assistant",
      icon: <MessageSquare className="w-6 h-6 text-gray-700" />,
      action: () => console.log("Ask AI"),
      badge: "Beta",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tighter text-black">Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">Get things done faster with one-click actions</p>
        </div>

        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent">
          <Zap className="w-4 h-4 mr-2" />
          Customize
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <QuickActionCard {...action} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
