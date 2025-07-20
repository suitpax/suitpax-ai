"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Bot, CreditCard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Business Travel",
    href: "/dashboard/business-travel",
    icon: Briefcase,
  },
  {
    title: "AI Agents",
    href: "/dashboard/ai-agents",
    icon: Bot,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax Logo" width={32} height={32} />
            <span className="">Suitpax</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  {
                    "bg-gray-200/50 text-gray-900 dark:bg-gray-800 dark:text-gray-50": pathname === item.href,
                  },
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
