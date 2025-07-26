"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  PiList,
  PiMagnifyingGlass,
  PiHouse,
  PiAirplaneTilt,
  PiRobot,
  PiCreditCard,
  PiGear,
  PiSignOut,
} from "react-icons/pi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface HeaderProps {
  onToggleSidebar: () => void
}

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

export default function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "https://suitpax.com"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar}>
            <PiList className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-[280px] sm:w-[280px]">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Image src="/logo/suitpax-symbol.webp" alt="Suitpax Logo" width={24} height={24} />
                <span>Suitpax</span>
              </Link>
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
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <PiSignOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <PiMagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-gray-100 pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <UserNav />
    </header>
  )
}
