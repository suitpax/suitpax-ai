"use client"

import { motion } from "framer-motion"
import { FlightTracker } from "@/components/dashboard/airlabs/flight-tracker"
import { AirportInfo } from "@/components/dashboard/airlabs/airport-info"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, MapPin, Building2, Globe, TrendingUp, Clock } from "lucide-react"

export default function AirDataPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none text-gray-900">
              Air Data
            </h1>
            <p className="text-gray-600 font-light">
              <em className="font-serif italic">Real-time aviation intelligence and flight tracking</em>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gray-900 text-white border-gray-800 rounded-lg px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></div>
              Live Data
            </Badge>
            <Badge className="bg-gray-200 text-gray-800 border-gray-300 rounded-lg px-3 py-1">AirLabs API</Badge>
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[{ title: "Global Flights", icon: Plane, accent: "bg-gray-900 text-white" }, { title: "Airports", icon: MapPin, accent: "bg-gray-900 text-white" }, { title: "Airlines", icon: Building2, accent: "bg-gray-900 text-white" }, { title: "Countries", icon: Globe, accent: "bg-gray-900 text-white" }].map(({ title, icon: Icon, accent }, i) => (
          <Card key={title} className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                  <div className="text-2xl font-semibold text-gray-900">Live</div>
                </div>
                <div className={`p-3 rounded-xl ${accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Real-time updates</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium tracking-tight text-gray-900">Live Flight Tracker</CardTitle>
              <CardDescription className="text-gray-600">Global positions and status via ADS-B</CardDescription>
            </CardHeader>
            <CardContent>
              <FlightTracker />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium tracking-tight text-gray-900">Airport Intel</CardTitle>
              <CardDescription className="text-gray-600">Lookups by IATA/ICAO, info and timezone</CardDescription>
            </CardHeader>
            <CardContent>
              <AirportInfo />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
        <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">Aviation Data Features</CardTitle>
            <CardDescription className="text-gray-600">Comprehensive datasets powered by AirLabs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-900" />
                  <h3 className="font-semibold text-gray-900">Real-time Tracking</h3>
                </div>
                <p className="text-sm text-gray-600">Live flight positions, altitudes, speeds, callsigns, squawks and status from ADS-B</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-900" />
                  <h3 className="font-semibold text-gray-900">Airport Database</h3>
                </div>
                <p className="text-sm text-gray-600">Runway data, terminals/gates, geolocation, IATA/ICAO, timezones</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-900" />
                  <h3 className="font-semibold text-gray-900">Schedule & Routes</h3>
                </div>
                <p className="text-sm text-gray-600">Timetables, route networks, delays and cancellations for planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
