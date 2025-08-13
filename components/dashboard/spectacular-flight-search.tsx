"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plane, Calendar, MapPin, Users, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SpectacularFlightSearch() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchQuery)
    }
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="text-center mb-6">
        <motion.h2
          className="text-2xl font-medium tracking-tight text-gray-900 mb-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent animate-pulse"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find Your Perfect Flight
        </motion.h2>
        <p className="text-sm text-gray-600">Search flights or ask our AI for personalized recommendations</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Where would you like to go? Ask AI anything..."
            className="w-full pl-12 pr-16 py-4 text-base bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-0 transition-all shadow-sm hover:shadow-md"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-gray-500" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-4 py-2"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: MapPin, label: "Popular Routes", count: "12" },
          { icon: Calendar, label: "Best Deals", count: "8" },
          { icon: Users, label: "Business Class", count: "5" },
          { icon: Sparkles, label: "AI Suggestions", count: "15" },
        ].map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <item.icon className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-xs font-medium text-gray-900">{item.label}</span>
            <span className="text-xs text-gray-500">{item.count} options</span>
          </motion.button>
        ))}
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 pt-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">From</label>
              <Input placeholder="Departure city" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">To</label>
              <Input placeholder="Destination city" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Date</label>
              <Input type="date" className="rounded-xl" />
            </div>
          </div>
          <Button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl">Search Flights</Button>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
        <span>Powered by Suitpax AI</span>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
