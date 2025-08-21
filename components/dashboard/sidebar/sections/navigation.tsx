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
      {nav.map((item) => (
        <SidebarMenuItem key={item.name}>
          <Link href={item.href} onClick={isMobile ? onCloseMobile : undefined} className={cn("flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-gray-100 text-gray-900", pathname.startsWith(item.href) && "bg-gray-900 text-white hover:bg-gray-900") }>
            <item.icon className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
          </Link>
        </SidebarMenuItem>
      ))}
    </>
  )
}

