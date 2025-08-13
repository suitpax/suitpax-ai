"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Plane, TrendingUp, Globe, Calendar, ArrowRight, Zap } from "lucide-react"
import { NumberFlow } from "@/components/ui/number-flow"
import { useFlightTracking } from "@/hooks/use-flight-tracking"
import Link from "next/link"

interface FlightRoute {
  id: string
  from: string
  to: string
  airline: string
  flight_number: string
  departure_time: string
  arrival_time: string
  status: "scheduled" | "boarding" | "departed" | "arrived"
  aircraft_type: string
}

export function FlightsVisualization() {
  const { activeFlights, totalFlights, monthlyFlights, loading } = useFlightTracking()
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null)

  const stats = [
    {
      label: "Monthly Delivered",
      value: monthlyFlights,
      change: "+32%",
      icon: Calendar,
    },
    {
      label: "Yearly Delivered",
      value: totalFlights,
      change: "+12%",
      icon: TrendingUp,
    },
  ]

  const mockRoutes: FlightRoute[] = [
    {
      id: "AA-845",
      from: "USA",
      to: "COL",
      airline: "American Airlines",
      flight_number: "AA-845",
      departure_time: "2024-06-05T14:30:00Z",
      arrival_time: "2024-06-05T22:15:00Z",
      status: "departed",
      aircraft_type: "Boeing 737",
    },
    {
      id: "JL-748",
      from: "CHN",
      to: "KOR",
      airline: "Japan Airlines",
      flight_number: "JL-748",
      departure_time: "2024-06-03T09:20:00Z",
      arrival_time: "2024-06-03T15:45:00Z",
      status: "arrived",
      aircraft_type: "Airbus A350",
    },
    {
      id: "MU-131",
      from: "JPN",
      to: "DEU",
      airline: "China Eastern",
      flight_number: "MU-131",
      departure_time: "2024-04-25T16:10:00Z",
      arrival_time: "2024-04-26T08:30:00Z",
      status: "arrived",
      aircraft_type: "Boeing 777",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Global View Header */}
      <Card className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 border-blue-800 text-white overflow-hidden relative">
        {/* Background globe effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
        </div>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-800/50 rounded-lg flex items-center justify-center border border-blue-700">
                <Globe className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-white text-xl font-medium">Global Flight View</CardTitle>
                <p className="text-blue-200 text-sm">AI-Powered Route Planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-200 text-xs">LIVE TRACKING</span>
              <span className="text-blue-300 text-xs">153 ms</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-6 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-right"
              >
                <div className="text-blue-200 text-sm mb-1">{stat.label}</div>
                <div className="flex items-center justify-end space-x-2">
                  <NumberFlow value={stat.value} className="text-2xl font-medium text-white" />
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm">{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Globe Placeholder */}
          <div className="relative bg-blue-800/30 rounded-xl p-8 border border-blue-700/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center relative overflow-hidden">
                <Globe className="h-16 w-16 text-white animate-spin" style={{ animationDuration: "20s" }} />

                {/* Flight markers */}
                <div className="absolute top-4 right-6 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div className="absolute bottom-8 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div className="absolute top-12 left-8 w-2 h-2 bg-blue-300 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping"></div>
                </div>
              </div>

              <h3 className="text-lg font-medium text-white mb-2">Plan Your Route with AI Now ✨</h3>
              <p className="text-blue-200 text-sm mb-4">
                Intelligent flight optimization powered by advanced algorithms
              </p>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-800/50 border-blue-600 text-blue-200 hover:bg-blue-700/50"
                >
                  HOW IT WORKS
                </Button>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
                    <Globe className="h-4 w-4 mr-1" />
                    3D
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
                    2D
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-200 text-sm">Zoom</span>
                  <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white w-8 h-8 p-0">
                    +
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white w-8 h-8 p-0">
                    -
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Activities */}
      <Card className="bg-white/50 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 font-medium">Recent Flight Activities</CardTitle>
            <Link href="/dashboard/flights">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                View All Flights
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {mockRoutes.length === 0 ? (
            <div className="text-center py-8">
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No flights yet</h3>
              <p className="text-gray-600 mb-4">Start planning your business trips to see flight activities here</p>
              <Link href="/dashboard/flights">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Search Flights
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 pb-2 border-b border-gray-200">
                <div>Flight ID</div>
                <div>Destination</div>
                <div>Arrival Date</div>
                <div>Status</div>
              </div>

              {mockRoutes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-4 gap-4 items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Plane className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{route.flight_number}</div>
                      <div className="text-xs text-gray-500">{route.airline}</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{route.from}</span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-gray-900">{route.to}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(route.departure_time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="text-sm text-gray-900">{new Date(route.arrival_time).toLocaleDateString()}</div>

                  <div>
                    <Badge
                      variant={route.status === "arrived" ? "default" : "secondary"}
                      className={
                        route.status === "arrived"
                          ? "bg-green-100 text-green-800"
                          : route.status === "departed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                      }
                    >
                      {route.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
