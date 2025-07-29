"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, MessageSquare, CreditCard, Users, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: "Book a Flight",
      description: "Find and book your next business trip",
      icon: <Plane className="h-5 w-5" />,
      href: "/dashboard/flights",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "AI Assistant",
      description: "Chat with your travel AI assistant",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/dashboard/ai-chat",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Manage Expenses",
      description: "Track and manage travel expenses",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/dashboard/expenses",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Team Management",
      description: "Invite and manage team members",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/team",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      title: "Trip Calendar",
      description: "View your upcoming trips",
      icon: <Calendar className="h-5 w-5" />,
      href: "/dashboard/calendar",
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      title: "Travel Policies",
      description: "Review company travel policies",
      icon: <MapPin className="h-5 w-5" />,
      href: "/dashboard/policies",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
  ]

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-tighter">Quick Actions</CardTitle>
        <CardDescription>Common tasks to get you started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant="outline"
              className={`h-auto p-4 justify-start text-left border ${action.color} hover:opacity-80`}
            >
              <Link href={action.href}>
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{action.icon}</div>
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-70 mt-1">{action.description}</div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
