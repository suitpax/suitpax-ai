"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PiHouse, PiAirplaneTilt, PiRobot, PiCreditCard, PiGear, PiBell } from "react-icons/pi"
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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo/suitpax-symbol.webp" alt="Suitpax Logo" width={24} height={24} />
            <span>Suitpax</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8 bg-transparent">
            <PiBell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  pathname === item.href && "bg-gray-200/50 text-gray-900",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
