"use client"

import Link from "next/link"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/primitives/sidebar"
import { LayoutDashboard, Plane, BarChart3, MessageSquare, Mic, Settings, Send } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DashboardSidebarContent({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
	const pathname = usePathname()
	const nav = [
		{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
		{ name: "Flights", href: "/dashboard/flights", icon: Plane },
		{ name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
		{ name: "Suitpax AI", href: "/dashboard/suitpax-ai", icon: MessageSquare },
		{ name: "Voice AI", href: "/dashboard/voice-ai", icon: Mic },
		{ name: "Settings", href: "/dashboard/settings", icon: Settings },
	]
	return (
		<SidebarMenu>
			{!isCollapsed && (
				<div className="px-3 pb-2">
					<div className="flex items-center gap-2 bg-white/80 border border-gray-200 rounded-2xl p-2">
						<Input placeholder="Ask Suitpax AI…" className="bg-transparent border-0 h-7 text-sm" />
						<Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-xl">
							<Send className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			)}
			{nav.map((item) => (
				<SidebarMenuItem key={item.name}>
					<Link href={item.href} onClick={isMobile ? onCloseMobile : undefined} className={cn("flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-gray-100", pathname.startsWith(item.href) && "bg-gray-900 text-white hover:bg-gray-900") }>
						<item.icon className="h-4 w-4" />
						{!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
					</Link>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	)
}