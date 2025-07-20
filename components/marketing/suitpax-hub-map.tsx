"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  PiMapPinBold,
  PiUsersBold,
  PiChatCircleBold,
  PiBuildingsBold,
  PiCalendarBold,
  PiPhoneBold,
  PiVideoCameraBold,
  PiWaveformBold,
  PiLightningBold,
} from "react-icons/pi"

const teamMembers = [
  {
    name: "Ammar Foley",
    image: "/community/ammar-foley.webp",
    location: "San Francisco",
    status: "traveling",
    action: "Call",
    icon: PiPhoneBold,
  },
  {
    name: "Owen Harding",
    image: "/community/owen-harding.webp",
    location: "New York",
    status: "available",
    action: "Video",
    icon: PiVideoCameraBold,
  },
  {
    name: "Jordan Burgess",
    image: "/community/jordan-burgess.webp",
    location: "London",
    status: "in-event",
    action: "Join Live",
    icon: PiWaveformBold,
  },
  {
    name: "Nicolas Trevino",
    image: "/community/nicolas-trevino.webp",
    location: "Berlin",
    status: "traveling",
    action: "Schedule",
    icon: PiCalendarBold,
  },
  {
    name: "Scott Clayton",
    image: "/community/scott-clayton.webp",
    location: "Toronto",
    status: "available",
    action: "Connect",
    icon: PiLightningBold,
  },
  {
    name: "Lana Steiner",
    image: "/community/lana-steiner.jpg",
    location: "Paris",
    status: "in-event",
    action: "Join Event",
    icon: PiWaveformBold,
  },
]

const cityBadges = [
  {
    name: "London",
    image: "/placeholder.svg?height=32&width=48",
    members: 3,
  },
  {
    name: "San Francisco",
    image: "/placeholder.svg?height=32&width=48",
    members: 2,
  },
  {
    name: "Paris",
    image: "/placeholder.svg?height=32&width=48",
    members: 1,
  },
  {
    name: "New York",
    image: "/placeholder.svg?height=32&width=48",
    members: 4,
  },
]

const features = [
  {
    icon: PiMapPinBold,
    title: "Real-time Location",
    description: "See where your team is traveling in real-time",
  },
  {
    icon: PiUsersBold,
    title: "Team Connections",
    description: "Connect with colleagues in the same city",
  },
  {
    icon: PiChatCircleBold,
    title: "Smart Networking",
    description: "AI-powered introductions to relevant contacts",
  },
  {
    icon: PiBuildingsBold,
    title: "Company Hubs",
    description: "Discover partner offices and coworking spaces",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "traveling":
      return "bg-gray-400"
    case "available":
      return "bg-green-400"
    case "in-meeting":
      return "bg-orange-400"
    case "in-event":
      return "bg-blue-400"
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

  return (
    <section className="pt-20 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-gray-100/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-600 mb-8">
            Global Team Network
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-black mb-6 leading-none">
            <span className="font-serif italic">Connect</span> <span className="font-sans">with your team</span>
            <br />
            <span className="font-sans">anywhere in the</span> <span className="font-serif italic">world</span>
          </h2>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Uncover and activate high-intent teammates viewing your business travel opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Map Section */}
          <div className="relative">
            <div className="bg-gray-50/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-sm">
              <div
                className="relative w-full aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden bg-white border border-gray-200/50"
                style={{
                  backgroundImage: `url('/images/radial-pattern-bg.jpeg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="#e5e7eb" opacity="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />

                  {/* Connection lines between users */}
                  <g stroke="#e5e7eb" strokeWidth="1" opacity="0.3">
                    <line x1="20%" y1="25%" x2="45%" y2="35%" strokeDasharray="2,2" />
                    <line x1="45%" y1="35%" x2="70%" y2="25%" strokeDasharray="2,2" />
                    <line x1="20%" y1="60%" x2="45%" y2="70%" strokeDasharray="2,2" />
                    <line x1="45%" y1="70%" x2="70%" y2="60%" strokeDasharray="2,2" />
                  </g>
                </svg>

                {/* Team member avatars */}
                <div className="absolute inset-0">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.name}
                      className="absolute cursor-pointer group"
                      style={{
                        top: `${20 + (index % 3) * 25}%`,
                        left: `${15 + Math.floor(index / 3) * 25}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="relative">
                        {/* User avatar with subtle shadow */}
                        <div className="relative bg-white rounded-2xl p-1 shadow-sm border border-gray-200/50">
                          <Image
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            width={40}
                            height={40}
                            className="rounded-xl object-cover"
                          />
                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(
                              member.status,
                            )} rounded-full border-2 border-white shadow-sm`}
                          />
                        </div>

                        {/* Hacker News style badge */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                        >
                          <div className="bg-gray-100/90 backdrop-blur-sm text-gray-600 rounded-full px-2 py-1 text-[10px] font-medium whitespace-nowrap shadow-sm border border-gray-200/50">
                            <div className="flex items-center gap-1">
                              <member.icon className="w-2.5 h-2.5" />
                              <span>{member.action}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {selectedMember?.name === member.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-4 min-w-[160px] z-30"
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
                              <p className="text-sm font-medium text-black">{member.name}</p>
                              <p className="text-xs text-gray-500">{member.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-2 h-2 ${getStatusColor(member.status)} rounded-full`}></div>
                            <span className="text-xs text-gray-600">{getStatusLabel(member.status)}</span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium shadow-sm hover:bg-gray-800 transition-colors"
                          >
                            <member.icon className="w-3 h-3" />
                            {member.action}
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* City badges at bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {cityBadges.map((city, index) => (
                      <motion.div
                        key={city.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                        className="bg-gray-100/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-200/50 flex items-center gap-2"
                      >
                        <Image
                          src={city.image || "/placeholder.svg"}
                          alt={city.name}
                          width={16}
                          height={12}
                          className="rounded object-cover"
                        />
                        <div>
                          <p className="text-[10px] font-medium text-gray-700">{city.name}</p>
                        </div>
                        <div className="bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-[8px] font-medium">
                          {city.members}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* New connection badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="bg-gray-100/90 backdrop-blur-sm text-gray-600 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm border border-gray-200/50">
                    New connection
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm font-medium text-gray-700 mb-3">Live Team Activity</p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>6 traveling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>8 available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>2 in events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <div className="bg-gray-50/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-sm">
              <h3 className="text-2xl font-medium tracking-tight text-black mb-4">
                <span className="font-serif italic">Smart</span> <span className="font-sans">Team Discovery</span>
              </h3>
              <p className="text-gray-500 mb-8 font-light">
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
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-200/50 shadow-sm"
                  >
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-200/50">
                      <feature.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-black mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-500 font-light">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-medium text-sm shadow-sm hover:bg-gray-800 transition-colors border border-gray-200/20"
              >
                <PiMapPinBold className="w-4 h-4" />
                Try a demo for growth
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-20 text-center">
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-12 shadow-sm">
            <h3 className="text-3xl font-medium tracking-tight text-black mb-4">
              <span className="font-serif italic">Never</span> <span className="font-sans">travel alone again</span>
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto font-light">
              Join thousands of professionals who use Suitpax Hub Map to turn business trips into networking
              opportunities and meaningful connections.
            </p>

            {/* Mock website preview */}
            <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-sm max-w-md mx-auto">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-900">suitpax.com</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="h-2 bg-gray-100 rounded"></div>
                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                <div className="h-2 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-100/90 backdrop-blur-sm text-gray-600 rounded-full px-3 py-1.5 text-xs font-medium inline-block">
                Your demo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
