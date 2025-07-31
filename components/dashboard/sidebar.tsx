"use client"

import { useState, useEffect } from "react"
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
  ChevronLeftIcon,
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
  { name: "Suitpax AI", href: "/dashboard/ai-chat", icon: ChatBubbleLeftRightIcon },
  { name: "Voice AI", href: "/dashboard/voice-ai", icon: MicrophoneIcon },
]

const bottomNavigation = [{ name: "Settings", href: "/dashboard/settings", icon: CogIcon }]

export default function Sidebar({ user, userPlan = "free" }: SidebarProps) {
  const pathname = usePathname()
  const [businessTravelOpen, setBusinessTravelOpen] = useState(true)
  const [aiAgentsOpen, setAiAgentsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const isPremium = userPlan === "premium" || userPlan === "enterprise"

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsCollapsed(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <motion.div
      animate={{
        width: isCollapsed && !isMobile ? 80 : isMobile ? "100%" : 280,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 relative"
    >
      {/* Collapse Toggle Button - Desktop Only */}
      {!isMobile && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-3 w-3 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-3 w-3 text-gray-600" />
          )}
        </button>
      )}

      <div className="px-6 py-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-center">
          <AnimatePresence mode="wait">
            {isCollapsed && !isMobile ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Image className="h-8 w-auto" src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={32} />
              </motion.div>
            )}
          </AnimatePresence>
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
                    } ${isCollapsed && !isMobile ? "justify-center" : ""}`}
                    title={isCollapsed && !isMobile ? "Dashboard" : ""}
                  >
                    <HomeIcon className="h-5 w-5 shrink-0" />
                    <AnimatePresence>
                      {(!isCollapsed || isMobile) && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          Dashboard
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>

                {/* Business Travel Section */}
                {(!isCollapsed || isMobile) && (
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
                )}

                {/* Collapsed Business Travel Items */}
                {isCollapsed && !isMobile && (
                  <>
                    {navigation.slice(1).map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex justify-center rounded-xl p-3 text-sm leading-6 transition-colors ${
                            pathname === item.href
                              ? "bg-gray-50 text-black font-medium"
                              : "text-gray-600 hover:text-black hover:bg-gray-50"
                          }`}
                          title={item.name}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </>
                )}

                {/* AI Agents Section */}
                {(!isCollapsed || isMobile) && (
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
                        Suitpax AI
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
                                  {!isPremium && item.name === "Voice AI" && (
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
                )}

                {/* Collapsed AI Items */}
                {isCollapsed && !isMobile && (
                  <>
                    {aiFeatures.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex justify-center rounded-xl p-3 text-sm leading-6 transition-colors ${
                            pathname === item.href
                              ? "bg-gray-50 text-black font-medium"
                              : "text-gray-600 hover:text-black hover:bg-gray-50"
                          }`}
                          title={item.name}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </>
                )}
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
                      } ${isCollapsed && !isMobile ? "justify-center" : ""}`}
                      title={isCollapsed && !isMobile ? item.name : ""}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* User Profile */}
              <div
                className={`mt-6 flex items-center gap-x-4 px-3 py-3 text-sm font-medium leading-6 text-gray-900 bg-gray-50 rounded-xl ${
                  isCollapsed && !isMobile ? "justify-center" : ""
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">{user.email?.charAt(0).toUpperCase()}</span>
                </div>
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate capitalize">{userPlan} plan</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </motion.div>
  )
}
