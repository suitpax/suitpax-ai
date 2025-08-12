"use client"

import { motion } from "framer-motion"
import { CalendarIcon, PlusIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

export default function CalendarPage() {
  const [selectedView, setSelectedView] = useState("month")

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2 text-black">
              <span className="shimmer-text">Travel Calendar</span>
            </h1>
            <p className="text-gray-600 font-light">
              <em className="font-serif italic">Organize your business trips with precision</em>
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["month", "week", "day"].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                    selectedView === view ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Trip
            </button>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Calendar Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-black">December 2024</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-4 text-center">
                <span className="text-sm font-medium text-gray-600">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 bg-white">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5 + 1
              const isCurrentMonth = day > 0 && day <= 31
              const isToday = day === 15

              return (
                <div
                  key={i}
                  className={`min-h-[120px] p-3 border-r border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !isCurrentMonth ? "bg-gray-50/50" : ""
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isToday
                        ? "bg-black text-white w-6 h-6 rounded-full flex items-center justify-center"
                        : isCurrentMonth
                          ? "text-black"
                          : "text-gray-400"
                    }`}
                  >
                    {isCurrentMonth ? day : ""}
                  </div>
                  {/* Sample events */}
                  {day === 18 && (
                    <div className="space-y-1">
                      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-medium">
                        NYC Meeting
                      </div>
                    </div>
                  )}
                  {day === 22 && (
                    <div className="space-y-1">
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-medium">
                        London Trip
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <ClockIcon className="h-5 w-5" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
            </div>
            <h3 className="font-medium text-black mb-2">Upcoming Trips</h3>
            <p className="text-sm text-gray-600">View your scheduled business travel</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
            </div>
            <h3 className="font-medium text-black mb-2">Popular Destinations</h3>
            <p className="text-sm text-gray-600">Explore trending business locations</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
            </div>
            <h3 className="font-medium text-black mb-2">Schedule Meeting</h3>
            <p className="text-sm text-gray-600">Coordinate with your team</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
