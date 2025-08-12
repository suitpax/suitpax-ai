"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Search,
  Mic,
  Plus,
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  Settings,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VoiceAIPage() {
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Get user profile for display name
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
        if (profile) {
          setUser({ ...user, profile })
        }
      }
    }
    getUser()

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [supabase])

  const getDisplayName = () => {
    if (!user) return "User"
    return user.profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const formatDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const dayName = days[currentTime.getDay()]
    const monthName = months[currentTime.getMonth()]
    const date = currentTime.getDate()

    return `${dayName}, ${monthName} ${date}`
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">NB</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Financial Dashboard</h1>
              <p className="text-sm text-gray-600">Voice AI Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Plus className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-orange-500 text-white text-sm">
                  {getDisplayName()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-600">CEO Assistant</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Start searching here..." className="pl-10 w-64 rounded-xl border-gray-300 bg-white" />
            </div>
          </div>
        </div>

        {/* Date and Tasks */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{currentTime.getDate()}</div>
              <div className="text-sm text-gray-600">{formatDate()}</div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6">Show my Tasks</Button>
            <Button variant="outline" size="icon" className="rounded-xl bg-transparent">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Voice AI Section */}
        <div className="mb-8">
          <Card className="bg-white rounded-3xl shadow-sm border-0 p-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mic className="h-6 w-6 text-orange-500" />
                <span className="text-lg font-medium text-gray-900">Voice AI Ready</span>
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Hey, {getDisplayName().split(" ")[0]}! Need help?
              </h2>
              <p className="text-xl text-gray-500 mb-8">Just ask me anything!</p>

              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 py-4 text-lg"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Start Voice Chat
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl px-8 py-4 text-lg border-gray-300 bg-transparent"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Voice Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white rounded-2xl shadow-sm border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">$23,194.80</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">$8,145.20</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-gray-500">Weekly</span>
              <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">System Lock</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <div className="text-white text-sm font-bold">36%</div>
                  </div>
                  <div className="text-xs text-gray-500">Growth rate</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">13 Days</p>
                <p className="text-xs text-gray-500">109 hours, 23 minutes</p>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={i} className={`w-2 h-6 rounded-sm ${i < 8 ? "bg-orange-500" : "bg-gray-200"}`} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Manager */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-2xl shadow-sm border-0 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Activity Manager</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">B</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Business plans</p>
                      <p className="text-sm text-gray-600">$43.20 USD</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 rounded-lg">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">B</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bank loans</p>
                      <p className="text-sm text-gray-600">Cards limitation</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-lg">
                    Pending
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Accounting</p>
                      <p className="text-sm text-gray-600">View on chart mode</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-lg">
                    Review
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">H</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">HR management</p>
                      <p className="text-sm text-gray-600">Employee records</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 rounded-lg">Complete</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Voice AI Features */}
          <div>
            <Card className="bg-white rounded-2xl shadow-sm border-0 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Voice AI Features</h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Mic className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Natural Speech</span>
                  </div>
                  <p className="text-sm text-gray-600">Speak naturally and get intelligent responses</p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Data Analysis</span>
                  </div>
                  <p className="text-sm text-gray-600">Ask questions about your business data</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Team Insights</span>
                  </div>
                  <p className="text-sm text-gray-600">Get insights about team performance</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-gray-900">24/7 Available</span>
                  </div>
                  <p className="text-sm text-gray-600">Always ready to help with your queries</p>
                </div>
              </div>

              <Button className="w-full mt-6 bg-black hover:bg-gray-800 text-white rounded-xl">
                <Mic className="h-4 w-4 mr-2" />
                Try Voice AI Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
