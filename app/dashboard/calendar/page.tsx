"use client"

import { motion } from "framer-motion"
import { CalendarIcon, PlusIcon, MapPinIcon, ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

export default function CalendarPage() {
  const [selectedView, setSelectedView] = useState("month")
  const [selectedDate, setSelectedDate] = useState(15)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
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
            <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-gray-200">
              {["month", "week", "day"].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                    selectedView === view
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:text-black hover:bg-white/50"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
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
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-lg"
        >
          {/* Calendar Header */}
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black">December 2024</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                  Today
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <span className="text-sm font-semibold text-black">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 bg-gray-50">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5 + 1
              const isCurrentMonth = day > 0 && day <= 31
              const isToday = day === 15
              const isSelected = day === selectedDate

              return (
                <div
                  key={i}
                  onClick={() => isCurrentMonth && setSelectedDate(day)}
                  className={`min-h-[120px] p-3 border-r border-b border-gray-200 hover:bg-white transition-all cursor-pointer ${
                    !isCurrentMonth ? "bg-gray-100" : "bg-gray-50"
                  } ${isSelected && isCurrentMonth ? "bg-white shadow-sm" : ""}`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                      isToday
                        ? "bg-black text-white"
                        : isSelected && isCurrentMonth
                          ? "bg-gray-200 text-black"
                          : isCurrentMonth
                            ? "text-black hover:bg-gray-200"
                            : "text-gray-400"
                    }`}
                  >
                    {isCurrentMonth ? day : ""}
                  </div>
                  {/* Enhanced events with better styling */}
                  {day === 18 && (
                    <div className="space-y-1">
                      <div className="bg-blue-100 text-blue-900 text-xs px-2 py-1 rounded-lg font-medium border border-blue-200">
                        NYC Meeting
                      </div>
                      <div className="text-xs text-gray-600">9:00 AM</div>
                    </div>
                  )}
                  {day === 22 && (
                    <div className="space-y-1">
                      <div className="bg-green-100 text-green-900 text-xs px-2 py-1 rounded-lg font-medium border border-green-200">
                        London Trip
                      </div>
                      <div className="text-xs text-gray-600">Flight: 2:30 PM</div>
                    </div>
                  )}
                  {day === 28 && (
                    <div className="space-y-1">
                      <div className="bg-purple-100 text-purple-900 text-xs px-2 py-1 rounded-lg font-medium border border-purple-200">
                        Team Retreat
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-lg hover:bg-white/90 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <ClockIcon className="h-6 w-6" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
            </div>
            <h3 className="font-semibold text-black mb-2">Upcoming Trips</h3>
            <p className="text-sm text-gray-600 mb-3">View your scheduled business travel</p>
            <div className="text-xs text-gray-500">3 trips this month</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-lg hover:bg-white/90 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <MapPinIcon className="h-6 w-6" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
            </div>
            <h3 className="font-semibold text-black mb-2">Popular Destinations</h3>
            <p className="text-sm text-gray-600 mb-3">Explore trending business locations</p>
            <div className="text-xs text-gray-500">NYC, London, Tokyo</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-lg hover:bg-white/90 transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
            </div>
            <h3 className="font-semibold text-black mb-2">Schedule Meeting</h3>
            <p className="text-sm text-gray-600 mb-3">Coordinate with your team</p>
            <div className="text-xs text-gray-500">Available slots today</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
