"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, TrendingUp, Clock, Users, Star } from "lucide-react"
import { businessCities, type City } from "@/data/cities"

interface TopDestinationsCardProps {
  className?: string
}

export function TopDestinationsCard({ className }: TopDestinationsCardProps) {
  const [topDestinations, setTopDestinations] = useState<City[]>([])

  useEffect(() => {
    const selectedCities = businessCities
      .filter((city) => city.businessImportance === "high")
      .slice(0, 6)
      .map((city) => ({
        ...city,
        // Add mock travel data for demonstration
        visits: Math.floor(Math.random() * 12) + 1,
        lastVisit: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        avgStay: Math.floor(Math.random() * 5) + 2,
      }))

    setTopDestinations(selectedCities)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        {/* Header - removed black bars from top */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tighter text-gray-900">Top Business Destinations</h3>
                <p className="text-xs text-gray-500 font-light">Your most visited locations with travel insights</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
              <TrendingUp className="h-3 w-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Analytics</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>6 destinations tracked</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last updated: Today</span>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topDestinations.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-md aspect-[3/2] mb-2">
                  <Image
                    src={city.imageUrl || "/placeholder.svg"}
                    alt={`${city.name}, ${city.country}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-1 left-1 right-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="truncate mb-1">{city.description}</div>
                      <div className="flex items-center justify-between">
                        <span>{city.visits} visits</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                          <span>4.{Math.floor(Math.random() * 9) + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{city.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{city.country}</p>

                  {/* Travel stats - changed emerald dot to gray */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <span>{city.visits} trips</span>
                    </div>
                    <span>{city.avgStay}d avg</span>
                  </div>

                  {/* Last visit */}
                  <div className="text-[10px] text-gray-400">Last: {city.lastVisit}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State Message */}
          {topDestinations.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">No travel history yet</p>
              <p className="text-xs text-gray-400 mt-1">Your destinations will appear here after your first trip</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">
                  {topDestinations.reduce((sum, city) => sum + city.visits, 0)}
                </div>
                <div className="text-xs text-gray-500">Total Trips</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">
                  {Math.round(topDestinations.reduce((sum, city) => sum + city.avgStay, 0) / topDestinations.length) ||
                    0}
                  d
                </div>
                <div className="text-xs text-gray-500">Avg Stay</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>AI-powered travel insights</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse"></div>
                <span>Live data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
