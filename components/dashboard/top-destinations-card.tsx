"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, TrendingUp } from "lucide-react"
import { businessCities, type City } from "@/data/cities"

interface TopDestinationsCardProps {
  className?: string
}

export function TopDestinationsCard({ className }: TopDestinationsCardProps) {
  const [topDestinations, setTopDestinations] = useState<City[]>([])

  useEffect(() => {
    // For now, we'll show a selection of top business cities
    // In the future, this would be based on user's actual travel history
    const selectedCities = businessCities.filter((city) => city.businessImportance === "high").slice(0, 6)

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
        {/* Header with black bars */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-gray-800 to-black"></div>
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium tracking-tighter text-gray-900">Top Destinations</h3>
                  <p className="text-xs text-gray-500 font-light">Popular business travel locations</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                <TrendingUp className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Trending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {topDestinations.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-md aspect-[4/3] mb-2">
                  <Image
                    src={city.imageUrl || "/placeholder.svg"}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {city.description}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{city.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{city.country}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {city.businessImportance} Priority
                    </span>
                  </div>
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

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Based on business travel patterns</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                <span>Updated daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
