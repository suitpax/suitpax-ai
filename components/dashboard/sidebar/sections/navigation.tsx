"use client"

import Link from "next/link"
import { SidebarMenuItem } from "@/components/ui/primitives/sidebar"
import { PiSquaresFourBold, PiAirplaneTiltBold, PiChartBarBold, PiChatsBold, PiMicrophoneBold, PiGearBold } from "react-icons/pi"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function NavigationSection({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
  const pathname = usePathname()
  const nav = [
    { name: "Dashboard", href: "/dashboard", icon: PiSquaresFourBold },
    { name: "Flights", href: "/dashboard/flights", icon: PiAirplaneTiltBold },
    { name: "Analytics", href: "/dashboard/analytics", icon: PiChartBarBold },
    { name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: PiChatsBold },
    { name: "Voice AI", href: "/dashboard/voice-ai", icon: PiMicrophoneBold },
    { name: "Settings", href: "/dashboard/settings", icon: PiGearBold },
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
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-gray-900",
                active ? "bg-gray-200 text-gray-900 border border-gray-200" : "hover:bg-gray-100"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {!isCollapsed && <span className="text-[13px] font-medium">{item.name}</span>}
            </Link>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}

