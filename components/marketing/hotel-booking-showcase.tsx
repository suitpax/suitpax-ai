"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { PiMagnifyingGlass, PiCalendar, PiUsers, PiStar, PiArrowRight } from "react-icons/pi"

const hotels = [
  {
    name: "The Peninsula",
    city: "New York",
    price: 950,
    rating: 4.9,
    image: "/images/hilton-san-francisco.png",
  },
  {
    name: "Hilton Union Square",
    city: "San Francisco",
    price: 480,
    rating: 4.5,
    image: "/images/hilton-san-francisco.png",
  },
  {
    name: "The Ritz-Carlton",
    city: "Tokyo",
    price: 1200,
    rating: 4.8,
    image: "/images/hilton-san-francisco.png",
  },
]

export default function HotelBookingShowcase() {
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 1500)
  }

  return (
    <section className="w-full py-20 md:py-28 bg-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-4">
            Global Hotel Network
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-black leading-tight max-w-3xl mx-auto">
            Premium stays, simplified.
            <span className="italic font-serif text-gray-600"> Book in seconds.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6">
          {/* Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 pb-4 mb-6">
            <div className="relative">
              <PiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="City or hotel"
                defaultValue="New York"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
            <div className="relative">
              <PiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Dates"
                defaultValue="Oct 14 - Oct 18"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
            <div className="relative">
              <PiUsers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Guests"
                defaultValue="1 guest"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Hotel Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hotels.map((hotel, index) => (
              <motion.div
                key={hotel.name}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-40">
                  <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} layout="fill" objectFit="cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-black truncate">{hotel.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{hotel.city}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <PiStar className="h-3.5 w-3.5 text-yellow-500" fill="currentColor" />
                      <span className="text-xs font-medium">{hotel.rating}</span>
                    </div>
                    <p className="text-sm font-semibold text-black">
                      ${hotel.price}
                      <span className="text-xs font-normal text-gray-500">/night</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-1.5 text-sm font-medium text-black hover:text-gray-700">
              See more options <PiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
