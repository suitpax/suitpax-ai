"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PiHouse, PiAirplaneTilt, PiRobot, PiCreditCard, PiGear, PiBell, PiX } from "react-icons/pi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: PiHouse,
  },
  {
    title: "Business Travel",
    href: "/dashboard/business-travel",
    icon: PiAirplaneTilt,
  },
  {
    title: "AI Agents",
    href: "/dashboard/ai-agents",
    icon: PiRobot,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: PiCreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: PiGear,
  },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 md:relative md:z-auto",
          isCollapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "w-64 md:w-64",
        )}
      >
        <div className="flex h-full max-h-screen flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className={cn("flex items-center gap-2 font-semibold transition-all", isCollapsed && "md:justify-center")}
            >
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax Logo"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              {!isCollapsed && <span className="text-gray-900">Suitpax</span>}
            </Link>

            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-gray-200">
                  <PiBell className="h-4 w-4 text-gray-600" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              )}

              <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onToggle}>
                <PiX className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 py-4 text-sm font-medium lg:px-4">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 transition-all hover:text-gray-900 hover:bg-gray-50",
                    pathname === item.href && "bg-gray-100 text-gray-900 font-medium",
                    isCollapsed && "md:justify-center md:px-2",
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Upgrade Card */}
          {!isCollapsed && (
            <div className="mt-auto p-4">
              <Card className="border-gray-200">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm text-gray-900">Upgrade to Pro</CardTitle>
                  <CardDescription className="text-xs text-gray-600">
                    Unlock all features and get unlimited access.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Button size="sm" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
