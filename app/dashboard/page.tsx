"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TrendingUp,
  Users,
  Building2,
  Plane,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Sparkles,
  Globe,
  Shield,
} from "lucide-react"
import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard"
import { BankConnectionCard } from "@/components/dashboard/bank-connection-card"
import { TopDestinationsCard } from "@/components/dashboard/top-destinations-card"
import { AiSearchInput } from "@/components/ui/ai-search-input"

export default function DashboardPage() {
  const [showQuickActions, setShowQuickActions] = useState(false)

  const getDisplayName = (user: any) => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    if (user?.email) return user.email.split("@")[0]
    return "User"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const dashboardSections = [
    {
      id: "user-profile",
      component: (
        <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 rounded-md border-2 border-gray-200">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback className="rounded-md bg-gray-100 text-gray-700 font-medium">
                  {getInitials("John Doe")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-medium tracking-tighter text-gray-900">
                  Welcome back, {getDisplayName({ user_metadata: { full_name: "John Doe" } })}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Business Travel Manager</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-gray-700 mr-1.5"></div>
                    Premium Plan
                  </Badge>
                  <Badge className="inline-flex items-center rounded-xl bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    <Building2 className="w-3 h-3 mr-1" />
                    Acme Corp
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-gray-200 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <div className="text-lg font-medium text-gray-900">24</div>
              <div className="text-xs text-gray-600">Trips This Year</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <div className="text-lg font-medium text-gray-900">$12,450</div>
              <div className="text-xs text-gray-600">Total Saved</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <div className="text-lg font-medium text-gray-900">98%</div>
              <div className="text-xs text-gray-600">Policy Compliance</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50">
              <div className="text-lg font-medium text-gray-900">4.9</div>
              <div className="text-xs text-gray-600">Avg Rating</div>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: "kpis",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-medium tracking-tighter text-gray-900 mt-1">$0</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trips</p>
                <p className="text-2xl font-medium tracking-tighter text-gray-900 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-1">In progress</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Plane className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-medium tracking-tighter text-gray-900 mt-1">0</p>
                <p className="text-xs text-gray-500 mt-1">Active users</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Savings</p>
                <p className="text-2xl font-medium tracking-tighter text-gray-900 mt-1">$0</p>
                <p className="text-xs text-gray-500 mt-1">vs budget</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "bank-connection",
      component: <BankConnectionCard />,
    },
    {
      id: "top-destinations",
      component: <TopDestinationsCard />,
    },
    {
      id: "suitpax-ai-chat",
      component: (
        <Card className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <img src="/suitpax-bl-logo.webp" alt="Suitpax AI" className="h-6 w-6 rounded-md" />
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tighter text-gray-900">Suitpax AI Assistant</h3>
                  <p className="text-sm text-gray-600">Your intelligent travel companion</p>
                </div>
              </div>
              <Badge className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                <div className="w-2 h-2 rounded-full bg-gray-700 mr-1.5 animate-pulse"></div>
                Online
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent animate-pulse">
                    AI-Powered Insights
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Get personalized travel recommendations and expense optimization
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Globe className="w-4 h-4 mr-2" />
                Find best flight deals
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze expense patterns
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Shield className="w-4 h-4 mr-2" />
                Check policy compliance
              </Button>
            </div>

            <div className="relative">
              <AiSearchInput placeholder="Ask Suitpax AI anything..." />
            </div>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tighter text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your business travel efficiently</p>
        </div>
        <Button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="rounded-xl bg-gray-900 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      <DraggableDashboard sections={dashboardSections} />
    </div>
  )
}
