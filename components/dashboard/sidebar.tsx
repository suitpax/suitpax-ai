"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  CogIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  AirplaneIcon,
} from "@heroicons/react/24/outline"
import type { User } from "@supabase/supabase-js"

interface SidebarProps {
  user: User
  userPlan?: string
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Flights", href: "/dashboard/flights", icon: AirplaneIcon },
  { name: "Expenses", href: "/dashboard/expenses", icon: CreditCardIcon },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Team", href: "/dashboard/team", icon: UsersIcon },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Locations", href: "/dashboard/locations", icon: MapPinIcon },
]

const aiFeatures = [
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: ChatBubbleLeftRightIcon },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: MicrophoneIcon },
]

const bottomNavigation = [{ name: "Settings", href: "/dashboard/settings", icon: CogIcon }]

export default function Sidebar({ user, userPlan = "free" }: SidebarProps) {
  const pathname = usePathname()
  const [businessTravelOpen, setBusinessTravelOpen] = useState(true)
  const [aiAgentsOpen, setAiAgentsOpen] = useState(true)

  const isPremium = userPlan === "premium" || userPlan === "enterprise"

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 py-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Image className="h-8 w-auto" src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={32} />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {/* Dashboard Home */}
              <li>
                <Link
                  href="/dashboard"
                  className={`group flex gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-gray-50 text-black"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <HomeIcon className="h-5 w-5 shrink-0" />
                  Dashboard
                </Link>
              </li>

              {/* Business Travel Section */}
              <li>
                <div>
                  <button
                    onClick={() => setBusinessTravelOpen(!businessTravelOpen)}
                    className="flex w-full items-center gap-x-3 rounded-xl p-3 text-left text-sm font-medium leading-6 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    {businessTravelOpen ? (
                      <ChevronDownIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 shrink-0" />
                    )}
                    Business Travel
                  </button>
                  <AnimatePresence>
                    {businessTravelOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 px-2 space-y-1"
                      >
                        {navigation.slice(1).map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={`group flex gap-x-3 rounded-lg p-2 pl-8 text-sm leading-6 transition-colors ${
                                pathname === item.href
                                  ? "bg-gray-50 text-black font-medium"
                                  : "text-gray-600 hover:text-black hover:bg-gray-50"
                              }`}
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {item.name}
                              {!isPremium && item.name !== "Flights" && (
                                <span className="ml-auto inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                                  Pro
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </li>

              {/* AI Agents Section */}
              <li>
                <div>
                  <button
                    onClick={() => setAiAgentsOpen(!aiAgentsOpen)}
                    className="flex w-full items-center gap-x-3 rounded-xl p-3 text-left text-sm font-medium leading-6 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    {aiAgentsOpen ? (
                      <ChevronDownIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4 shrink-0" />
                    )}
                    AI Agents
                    <span className="ml-auto inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                      Beta
                    </span>
                  </button>
                  <AnimatePresence>
                    {aiAgentsOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 px-2 space-y-1"
                      >
                        {aiFeatures.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={`group flex gap-x-3 rounded-lg p-2 pl-8 text-sm leading-6 transition-colors ${
                                pathname === item.href
                                  ? "bg-gray-50 text-black font-medium"
                                  : "text-gray-600 hover:text-black hover:bg-gray-50"
                              }`}
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              {item.name}
                              {!isPremium && (
                                <span className="ml-auto inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                                  Pro
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}

                        {/* Create Agent Button */}
                        <li>
                          <button
                            className="group flex w-full gap-x-3 rounded-lg p-2 pl-8 text-sm leading-6 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                            disabled={!isPremium}
                          >
                            <PlusIcon className="h-4 w-4 shrink-0" />
                            Create Agent
                            {!isPremium && (
                              <span className="ml-auto inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                                Pro
                              </span>
                            )}
                          </button>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            </ul>
          </li>

          {/* Bottom Navigation */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {bottomNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-colors ${
                      pathname === item.href
                        ? "bg-gray-50 text-black"
                        : "text-gray-700 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Profile */}
            <div className="mt-6 flex items-center gap-x-4 px-3 py-3 text-sm font-medium leading-6 text-gray-900 bg-gray-50 rounded-xl">
              <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.email?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}
