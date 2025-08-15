"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Crown,
  Plus,
  MessageSquare,
  Calculator,
  BarChart3,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Command as CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import AiSearchInput from "@/components/ui/ai-search-input"
import { getPageTitle } from "@/lib/navigation"

interface HeaderProps {
  user: SupabaseUser
  userPlan: string
  subscriptionStatus: string
  onToggleSidebar: () => void
  isMobile: boolean
  sidebarCollapsed: boolean
}

export default function Header() {
  const pathname = usePathname()
  const pageInfo = getPageTitle(pathname)

  const quickLinks = [
    { name: "Book Flight", href: "/dashboard/flights", shortcut: "⌘F" },
    { name: "Add Expense", href: "/dashboard/expenses", shortcut: "⌘E" },
    { name: "Suitpax AI", href: "/dashboard/suitpax-ai", shortcut: "⌘A" },
    { name: "Analytics", href: "/dashboard/analytics", shortcut: "⌘R" },
  ]

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-medium tracking-tight">{pageInfo.title}</h1>
        <p className="text-xs text-gray-500">{pageInfo.description}</p>
      </div>
      <nav className="flex items-center gap-3">
        {quickLinks.map((link) => (
          <Link key={link.name} href={link.href} className="text-xs text-gray-600 hover:text-black">
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}
