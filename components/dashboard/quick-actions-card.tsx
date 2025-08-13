"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, CreditCard, Building2, FileText, MapPin, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  badge?: string
  color: "default" | "primary" | "secondary"
}

const quickActions: QuickAction[] = [
  {
    id: "book-flight",
    title: "Book Flight",
    description: "Find and book your next business trip",
    icon: <Plane className="w-5 h-5" />,
    href: "/dashboard/flights",
    badge: "Popular",
    color: "primary",
  },
  {
    id: "expense-report",
    title: "Add Expense",
    description: "Record a new business expense",
    icon: <CreditCard className="w-5 h-5" />,
    href: "/dashboard/expenses",
    color: "default",
  },
  {
    id: "connect-bank",
    title: "Connect Bank",
    description: "Link your business account",
    icon: <Building2 className="w-5 h-5" />,
    href: "/dashboard/suitpax-bank",
    badge: "Recommended",
    color: "secondary",
  },
  {
    id: "create-policy",
    title: "Travel Policy",
    description: "Set up travel guidelines",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/policies",
    color: "default",
  },
  {
    id: "schedule-meeting",
    title: "AI Assistant",
    description: "Get help with travel planning",
    icon: <Zap className="w-5 h-5" />,
    href: "/dashboard/suitpax-ai",
    color: "primary",
  },
  {
    id: "view-locations",
    title: "Locations",
    description: "Manage travel destinations",
    icon: <MapPin className="w-5 h-5" />,
    href: "/dashboard/locations",
    color: "default",
  },
]

export function QuickActionsCard() {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium tracking-tight text-gray-900">Quick Actions</CardTitle>
        <p className="text-sm text-gray-600">Common tasks to get you started</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <Button variant="ghost" className="w-full justify-start h-auto p-4 hover:bg-gray-50 group">
                <div className="flex items-center gap-4 w-full">
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${
                      action.color === "primary"
                        ? "bg-black text-white group-hover:bg-gray-800"
                        : action.color === "secondary"
                          ? "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }
                  `}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{action.title}</span>
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
