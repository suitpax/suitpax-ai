"use client"

import Link from "next/link"
import { SidebarMenuItem } from "@/components/ui/primitives/sidebar"
import { PiSquaresFourBold, PiAirplaneTiltBold, PiChartBarBold, PiChatsBold, PiMicrophoneBold, PiGearBold, PiBuildingsBold, PiUsersBold, PiShieldCheckBold, PiTrainBold, PiCalendarBold, PiCaretDownBold } from "react-icons/pi"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function NavigationSection({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
  const pathname = usePathname()
  const isPersonal = pathname.startsWith("/dashboard/user")
  const isAdmin = !isPersonal
  const [configOpen, setConfigOpen] = useState(true)
  const nav = isAdmin
    ? [
        { name: "Dashboard", href: "/dashboard", icon: PiSquaresFourBold },
        { name: "Flights", href: "/dashboard/flights", icon: PiAirplaneTiltBold },
        { name: "Stays", href: "/dashboard/hotels", icon: PiBuildingsBold },
        { name: "Rail", href: "/dashboard/trains", icon: PiTrainBold },
        { name: "Analytics", href: "/dashboard/analytics", icon: PiChartBarBold },
        { name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: PiChatsBold },
        { name: "Voice AI", href: "/dashboard/voice-ai", icon: PiMicrophoneBold },
        { name: "Settings", href: "/dashboard/settings", icon: PiGearBold },
      ]
    : [
        { name: "Flights", href: "/dashboard/flights", icon: PiAirplaneTiltBold },
        { name: "Hotels", href: "/dashboard/hotels", icon: PiBuildingsBold },
        { name: "Trains", href: "/dashboard/trains", icon: PiTrainBold },
        { name: "Events", href: "/dashboard/events", icon: PiCalendarBold },
      ]
  return (
    <>
      {nav.map((item) => {
        const active = pathname.startsWith(item.href)
        return (
          <SidebarMenuItem key={item.name}>
            <Link
              href={item.href}
              onClick={isMobile ? onCloseMobile : undefined}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-900",
                active ? "bg-gray-100 text-gray-900 border border-gray-200" : "hover:bg-gray-100"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {!isCollapsed && <span className="text-[13px] font-medium">{item.name}</span>}
            </Link>
          </SidebarMenuItem>
        )
      })}

      {/* Navigation section (renamed from Configuration) */}
      {isAdmin && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setConfigOpen((v) => !v)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-900 hover:bg-gray-100",
              configOpen && "bg-gray-100 border border-gray-200"
            )}
          >
            <PiShieldCheckBold className="h-3.5 w-3.5" />
            {!isCollapsed && <span className="text-[13px] font-medium flex-1 text-left">Navigation</span>}
            {!isCollapsed && <PiCaretDownBold className={cn("h-3.5 w-3.5 transition-transform", configOpen ? "rotate-180" : "rotate-0")} />}
          </button>
          {configOpen && (
            <div className="mt-1">
              {[
                { name: "Smart Policies", href: "/dashboard/policies", icon: PiShieldCheckBold },
                { name: "Organization", href: "/dashboard/organization", icon: PiBuildingsBold },
                { name: "Pax", href: "/dashboard/pax", icon: PiUsersBold },
              ].map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.name}>
                    <Link
                      href={item.href}
                      onClick={isMobile ? onCloseMobile : undefined}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-900",
                        active ? "bg-gray-100 text-gray-900 border border-gray-200" : "hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {!isCollapsed && <span className="text-[13px] font-medium">{item.name}</span>}
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}

