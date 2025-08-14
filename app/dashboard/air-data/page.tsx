"use client"

import { motion } from "framer-motion"
import { FlightTracker } from "@/components/dashboard/airlabs/flight-tracker"
import { AirportInfo } from "@/components/dashboard/airlabs/airport-info"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, MapPin, Building2, Globe, TrendingUp, Clock } from "lucide-react"
import SoftHero from "@/components/ui/soft-hero"

export default function AirDataPage() {
  return (
    <div className="p-0">
      <SoftHero
        eyebrow="AirData"
        title={<span>Live aviation intelligence</span>}
        description="Track global flights, airports and airlines in real time."
        primaryCta={{ label: "Explore flights" }}
        secondaryCta={{ label: "API Docs" }}
        className="pb-2"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2 text-gray-900">
                Air Data
              </h1>
              <p className="text-gray-600 font-light">
                <em className="font-serif italic">Real-time aviation intelligence and flight tracking</em>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-lg px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                Live Data
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200 rounded-lg px-3 py-1">AirLabs API</Badge>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Global Flights</p>
                  <div className="text-2xl font-semibold text-gray-900">Live</div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Real-time tracking</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Airports</p>
                  <div className="text-2xl font-semibold text-gray-900">28K+</div>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Worldwide coverage</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Airlines</p>
                  <div className="text-2xl font-semibold text-gray-900">1.2K+</div>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Active carriers</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Countries</p>
                  <div className="text-2xl font-semibold text-gray-900">195</div>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Global reach</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FlightTracker />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AirportInfo />
          </motion.div>
        </div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight text-gray-900">
                Aviation Data Features
              </CardTitle>
              <CardDescription className="text-gray-600">
                Comprehensive aviation intelligence powered by AirLabs API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Real-time Tracking</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Live flight positions, altitudes, speeds, and status updates from ADS-B data
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Airport Database</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Comprehensive airport information including codes, coordinates, and timezones
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Schedule Data</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Flight schedules, delays, and route information for comprehensive planning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
   )
}
