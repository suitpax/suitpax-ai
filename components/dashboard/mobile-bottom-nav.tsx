"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PiLayoutGridBold, PiAirplaneTiltBold, PiChatsBold, PiMicrophoneBold, PiChartBarBold } from "react-icons/pi"
import { cn } from "@/lib/utils"

const items = [
  { name: "Home", href: "/dashboard", icon: PiLayoutGridBold },
  { name: "Flights", href: "/dashboard/flights", icon: PiAirplaneTiltBold },
  { name: "Analytics", href: "/dashboard/analytics", icon: PiChartBarBold },
  { name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: PiChatsBold },
  { name: "Voice", href: "/dashboard/voice-ai", icon: PiMicrophoneBold },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <ul className="flex items-center justify-between gap-0.5 px-2 py-2">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-1 transition-colors",
                    isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="mt-0.5 text-[10px] leading-none font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

