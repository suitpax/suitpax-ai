"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Plane,
  Hotel,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Calendar,
  MapPin,
  MessageSquare,
  Mic,
  ChevronLeft,
  Zap,
  FileText,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const mainNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vista general",
  },
  {
    name: "AI Chat",
    href: "/dashboard/ai-chat",
    icon: MessageSquare,
    description: "Asistente IA",
    badge: "AI",
  },
  {
    name: "Voice AI",
    href: "/dashboard/voice-ai",
    icon: Mic,
    description: "Voz IA",
    badge: "Beta",
  },
]

const travelNavigation = [
  {
    name: "Flights",
    href: "/dashboard/flights",
    icon: Plane,
    description: "Vuelos",
  },
  {
    name: "Hotels",
    href: "/dashboard/hotels",
    icon: Hotel,
    description: "Hoteles",
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    description: "Calendario",
  },
  {
    name: "Locations",
    href: "/dashboard/locations",
    icon: MapPin,
    description: "Ubicaciones",
  },
]

const businessNavigation = [
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: CreditCard,
    description: "Gastos",
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
    description: "Equipo",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Analíticas",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Reportes",
  },
]

const settingsNavigation = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Configuración",
  },
]

interface NavigationSectionProps {
  title: string
  items: typeof mainNavigation
  collapsed: boolean
  pathname: string
}

function NavigationSection({ title, items, collapsed, pathname }: NavigationSectionProps) {
  return (
    <div className="mb-6">
      <AnimatePresence>
        {!collapsed && (
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="px-3 mb-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {title}
          </motion.h3>
        )}
      </AnimatePresence>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative",
                isActive ? "bg-black text-white shadow-sm" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.name : ""}
            >
              <div className={cn("flex items-center justify-center w-5 h-5 flex-shrink-0", !collapsed && "mr-3")}>
                <item.icon className="w-5 h-5" aria-hidden="true" />
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center justify-between flex-1 min-w-0"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{item.name}</span>
                      <span className="text-xs text-gray-500 truncate">{item.description}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0",
                          item.badge === "AI" ? "bg-black text-white" : "bg-gray-200 text-gray-700",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {collapsed && item.badge && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full"></div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Auto-collapse on mobile
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 border-b border-gray-200 flex items-center justify-center">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </aside>
    )
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/dashboard" className="flex items-center">
                <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={32} className="h-8 w-auto" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-xl hover:bg-gray-100 flex-shrink-0"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
          <span className="sr-only">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
        <NavigationSection title="Principal" items={mainNavigation} collapsed={collapsed} pathname={pathname} />

        <NavigationSection title="Viajes" items={travelNavigation} collapsed={collapsed} pathname={pathname} />

        <NavigationSection title="Negocio" items={businessNavigation} collapsed={collapsed} pathname={pathname} />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 mt-auto flex-shrink-0">
        <nav className="space-y-1">
          {settingsNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.name : ""}
              >
                <div className={cn("flex items-center justify-center w-5 h-5 flex-shrink-0", !collapsed && "mr-3")}>
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex flex-col min-w-0"
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="text-xs text-gray-500 truncate">{item.description}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* User Status */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 truncate">Suitpax Pro</p>
                  <p className="text-xs text-gray-500 truncate">Plan Empresarial</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}
