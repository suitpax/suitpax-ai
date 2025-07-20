"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Plane, Bot, Users, Settings, LifeBuoy, type LucideIcon } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/business-travel", label: "Business Travel", icon: Plane },
  { href: "/dashboard/ai-agents", label: "AI Agents", icon: Bot },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        <Link href="/dashboard">
          <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={30} />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-4 p-4">
        <ul className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900",
                  {
                    "bg-gray-100 font-medium text-gray-900": pathname === item.href,
                  },
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Link
            href="/support"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <LifeBuoy className="h-4 w-4" />
            Support
          </Link>
        </div>
      </nav>
    </aside>
  )
}
