"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, TrendingDown, Zap, MapPin, Calendar, DollarSign, CheckCircle } from "lucide-react"

interface CollaborativeSearchProps {
  userPlan: "free" | "basic" | "pro" | "custom"
}

export function CollaborativeSearchShowcase({ userPlan }: CollaborativeSearchProps) {
  const [isActive, setIsActive] = useState(false)
  const [teamBookings, setTeamBookings] = useState<any[]>([])
  const [savings, setSavings] = useState(0)

  const mockTeamBookings = [
    {
      employee: "Sarah Chen",
      destination: "Barcelona",
      date: "Mar 15-17",
      role: "Sales Manager",
      status: "grouped",
    },
    {
      employee: "Mike Johnson",
      destination: "Barcelona",
      date: "Mar 15-17",
      role: "Product Lead",
      status: "grouped",
    },
    {
      employee: "Ana Rodriguez",
      destination: "Barcelona",
      date: "Mar 16-18",
      role: "Designer",
      status: "optimized",
    },
    {
      employee: "Tom Wilson",
      destination: "Barcelona",
      date: "Mar 14-16",
      role: "Engineer",
      status: "negotiated",
    },
  ]

  const getFeaturesByPlan = () => {
    switch (userPlan) {
      case "free":
        return {
          teamSize: 3,
          groupBooking: false,
          negotiation: false,
          description: "See how team booking works",
        }
      case "basic":
        return {
          teamSize: 10,
          groupBooking: true,
          negotiation: false,
          description: "Basic team coordination and grouping",
        }
      case "pro":
        return {
          teamSize: 50,
          groupBooking: true,
          negotiation: true,
          description: "Advanced team optimization with negotiation",
        }
      case "custom":
        return {
          teamSize: "Unlimited",
          groupBooking: true,
          negotiation: true,
          description: "Enterprise team management with custom rules",
        }
    }
  }

  const features = getFeaturesByPlan()

  const simulateTeamBooking = () => {
    setIsActive(true)
    setTeamBookings([])
    setSavings(0)

    // Simulate team members booking
    mockTeamBookings.forEach((booking, index) => {
      setTimeout(
        () => {
          setTeamBookings((prev) => [...prev, booking])
          if (index === mockTeamBookings.length - 1) {
            // Calculate savings after all bookings
            setTimeout(() => {
              setSavings(1247)
            }, 1000)
          }
        },
        (index + 1) * 800,
      )
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "grouped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "optimized":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "negotiated":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-emerald-900/20 to-black border border-gray-700 shadow-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight">Collaborative Search</h3>
            <p className="text-gray-400 text-sm">{features.description}</p>
          </div>
          <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {features.teamSize} Team Size
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">40%</div>
            <div className="text-xs text-gray-400">Cost Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">Auto</div>
            <div className="text-xs text-gray-400">Grouping</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-400">Real-time</div>
            <div className="text-xs text-gray-400">Coordination</div>
          </div>
        </div>

        <Button
          onClick={simulateTeamBooking}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white mb-4"
          disabled={userPlan === "free" && isActive}
        >
          <Zap className="h-4 w-4 mr-2" />
          {isActive ? "Demo Running..." : "Start Team Booking Demo"}
        </Button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Team Travel to Barcelona Conference</h4>
                {savings > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-green-400"
                  >
                    <TrendingDown className="h-4 w-4" />
                    <span className="font-bold">${savings} saved</span>
                  </motion.div>
                )}
              </div>

              {teamBookings.slice(0, userPlan === "free" ? 2 : teamBookings.length).map((booking, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {booking.employee
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-white font-medium">{booking.employee}</div>
                        <div className="text-gray-400 text-sm">{booking.role}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <MapPin className="h-3 w-3 text-blue-400" />
                      {booking.destination}
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <Calendar className="h-3 w-3 text-purple-400" />
                      {booking.date}
                    </div>
                  </div>
                </motion.div>
              ))}

              {savings > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-700/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Optimization Complete</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-gray-300">Group Discount: $847</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300">Route Optimization: $400</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {userPlan === "free" && (
                <div className="text-center py-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Upgrade to see full team coordination</p>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
