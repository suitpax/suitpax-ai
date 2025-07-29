"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  PiMapPinBold,
  PiUsersBold,
  PiBuildingsBold,
  PiCalendarBold,
  PiPhoneBold,
  PiVideoCameraBold,
  PiWaveformBold,
  PiLightningBold,
  PiGlobeBold,
  PiAirplaneBold,
} from "react-icons/pi"

const teamMembers = [
  {
    name: "Ammar Foley",
    image: "/community/ammar-foley.webp",
    location: "San Francisco",
    status: "traveling",
    action: "Call",
    icon: PiPhoneBold,
    position: { top: "25%", left: "20%" },
  },
  {
    name: "Owen Harding",
    image: "/community/owen-harding.webp",
    location: "New York",
    status: "available",
    action: "Video",
    icon: PiVideoCameraBold,
    position: { top: "35%", left: "75%" },
  },
  {
    name: "Jordan Burgess",
    image: "/community/jordan-burgess.webp",
    location: "London",
    status: "in-event",
    action: "Join Live",
    icon: PiWaveformBold,
    position: { top: "30%", left: "55%" },
  },
  {
    name: "Nicolas Trevino",
    image: "/community/nicolas-trevino.webp",
    location: "Berlin",
    status: "traveling",
    action: "Schedule",
    icon: PiCalendarBold,
    position: { top: "60%", left: "58%" },
  },
  {
    name: "Scott Clayton",
    image: "/community/scott-clayton.webp",
    location: "Toronto",
    status: "available",
    action: "Connect",
    icon: PiLightningBold,
    position: { top: "45%", left: "25%" },
  },
  {
    name: "Lana Steiner",
    image: "/community/lana-steiner.jpg",
    location: "Paris",
    status: "in-event",
    action: "Join Event",
    icon: PiWaveformBold,
    position: { top: "50%", left: "52%" },
  },
]

const cityHubs = [
  {
    name: "London",
    country: "UK",
    members: 12,
    activeNow: 3,
    coordinates: { top: "30%", left: "55%" },
  },
  {
    name: "San Francisco",
    country: "USA",
    members: 8,
    activeNow: 2,
    coordinates: { top: "40%", left: "15%" },
  },
  {
    name: "Paris",
    country: "France",
    members: 6,
    activeNow: 1,
    coordinates: { top: "45%", left: "50%" },
  },
  {
    name: "New York",
    country: "USA",
    members: 15,
    activeNow: 4,
    coordinates: { top: "35%", left: "25%" },
  },
  {
    name: "Tokyo",
    country: "Japan",
    members: 9,
    activeNow: 2,
    coordinates: { top: "45%", left: "85%" },
  },
]

const features = [
  {
    icon: PiGlobeBold,
    title: "Global Network",
    description: "Connect with team members across 50+ cities worldwide",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: PiUsersBold,
    title: "Smart Matching",
    description: "AI finds relevant colleagues in your destination city",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: PiAirplaneBold,
    title: "Travel Sync",
    description: "Coordinate meetings and shared travel experiences",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: PiBuildingsBold,
    title: "Office Hubs",
    description: "Access partner offices and premium coworking spaces",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "traveling":
      return "bg-blue-400"
    case "available":
      return "bg-green-400"
    case "in-meeting":
      return "bg-orange-400"
    case "in-event":
      return "bg-purple-400"
    default:
      return "bg-gray-300"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "traveling":
      return "Traveling"
    case "available":
      return "Available"
    case "in-meeting":
      return "In meeting"
    case "in-event":
      return "Live event"
    default:
      return "Offline"
  }
}

export default function SuitpaxHubMap() {
  const [selectedMember, setSelectedMember] = useState<(typeof teamMembers)[0] | null>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-gray-800/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-300 mb-8 border border-gray-700">
            <PiGlobeBold className="w-3 h-3 mr-2" />
            Global Team Network
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-none">
            <span className="font-serif italic">Connect</span> <span className="font-sans">with your team</span>
            <br />
            <span className="font-sans">anywhere in the</span> <span className="font-serif italic">world</span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Discover teammates, coordinate meetings, and turn business trips into networking opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Interactive World Map */}
          <div className="relative">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 shadow-2xl">
              <div
                className="relative w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl overflow-hidden bg-gray-800 border border-gray-700"
                style={{
                  backgroundImage: `url('/images/radial-pattern-bg.jpeg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark overlay for better contrast */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  {/* Animated connection lines */}
                  <g stroke="url(#connectionGradient)" strokeWidth="1" opacity="0.7">
                    <motion.line
                      x1="20%"
                      y1="25%"
                      x2="55%"
                      y2="30%"
                      strokeDasharray="3,3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    />
                    <motion.line
                      x1="55%"
                      y1="30%"
                      x2="75%"
                      y2="35%"
                      strokeDasharray="3,3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    />
                    <motion.line
                      x1="25%"
                      y1="45%"
                      x2="50%"
                      y2="45%"
                      strokeDasharray="3,3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                    />
                  </g>
                </svg>

                {/* City hubs */}
                {cityHubs.map((city, index) => (
                  <motion.div
                    key={city.name}
                    className="absolute cursor-pointer z-20"
                    style={city.coordinates}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2, type: "spring", stiffness: 300, damping: 20 }}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <div className="relative">
                      {/* Pulsing ring */}
                      <motion.div
                        className="absolute inset-0 w-8 h-8 bg-blue-500/20 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      />

                      {/* City marker */}
                      <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <PiMapPinBold className="w-3 h-3 text-white" />
                      </div>

                      {/* City info tooltip */}
                      {hoveredCity === city.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-700 p-3 min-w-[140px] z-30"
                        >
                          <div className="text-center">
                            <p className="text-sm font-medium text-white">{city.name}</p>
                            <p className="text-xs text-gray-400 mb-2">{city.country}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{city.members} members</span>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span className="text-green-400">{city.activeNow} active</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Team member avatars */}
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    className="absolute cursor-pointer group z-20"
                    style={member.position}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.5, type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.1, zIndex: 30 }}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="relative">
                      {/* User avatar */}
                      <div className="relative bg-gray-800 rounded-2xl p-1 shadow-lg border border-gray-600">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          width={36}
                          height={36}
                          className="rounded-xl object-cover"
                        />
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(
                            member.status,
                          )} rounded-full border-2 border-gray-900 shadow-sm`}
                        />
                      </div>

                      {/* Action badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.8 }}
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                      >
                        <div className="bg-gray-800/90 backdrop-blur-sm text-gray-300 rounded-full px-2 py-1 text-[9px] font-medium whitespace-nowrap shadow-lg border border-gray-600">
                          <div className="flex items-center gap-1">
                            <member.icon className="w-2 h-2" />
                            <span>{member.action}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Member details popup */}
                      {selectedMember?.name === member.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-4 min-w-[180px] z-40"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Image
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              width={32}
                              height={32}
                              className="rounded-xl object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-white">{member.name}</p>
                              <p className="text-xs text-gray-400">{member.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full`}></div>
                            <span className="text-xs text-gray-300">{getStatusLabel(member.status)}</span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-black rounded-xl text-xs font-medium shadow-sm hover:bg-gray-100 transition-colors"
                          >
                            <member.icon className="w-3 h-3" />
                            {member.action}
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Global stats overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-3 border border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-300">6 traveling</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300">12 available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-300">3 in events</span>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <span className="font-medium">21</span> active now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 shadow-2xl">
              <h3 className="text-2xl font-medium tracking-tight text-white mb-4">
                <span className="font-serif italic">Smart</span> <span className="font-sans">Team Discovery</span>
              </h3>
              <p className="text-gray-400 mb-8 font-light">
                AI-powered insights help you make the most of every business trip by connecting you with the right
                people at the right time.
              </p>

              <div className="grid grid-cols-1 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-800/30 border border-gray-700 shadow-sm hover:bg-gray-800/50 transition-colors"
                  >
                    <div className={`p-2 rounded-xl ${feature.bgColor} border border-gray-700`}>
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-400 font-light">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl font-medium text-sm shadow-lg hover:bg-gray-100 transition-colors"
              >
                <PiMapPinBold className="w-4 h-4" />
                Explore Global Network
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-12 shadow-2xl text-center">
            <h3 className="text-3xl font-medium tracking-tight text-white mb-4">
              <span className="font-serif italic">Never</span> <span className="font-sans">travel alone again</span>
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto font-light">
              Join thousands of professionals who use Suitpax Hub Map to turn business trips into networking
              opportunities and meaningful connections.
            </p>

            {/* Global stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50+</div>
                <div className="text-xs text-gray-400">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">2.5K+</div>
                <div className="text-xs text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">15K+</div>
                <div className="text-xs text-gray-400">Connections Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-xs text-gray-400">Satisfaction</div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 max-w-md mx-auto">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-white">suitpax.com/hub</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-2 bg-gray-700 rounded"></div>
                <div className="h-2 bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="h-2 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="bg-gray-700/50 text-gray-300 rounded-full px-3 py-1.5 text-xs font-medium inline-block">
                Your global network
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
