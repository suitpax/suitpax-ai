"use client"

import { SidebarHeader, useSidebar } from "@/components/ui/primitives/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PiDotsSixBold } from "react-icons/pi"

export default function DashboardSidebarHeader({ onToggle }: { onToggle?: () => void }) {
	const { toggleSidebar } = useSidebar()
	return (
		<SidebarHeader className="flex items-center justify-between bg-white/70 px-4">
			<div className="flex items-center gap-3 min-w-0">
				<Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={128} height={32} className="h-6 w-auto" />
			</div>
			<Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl" onClick={onToggle || toggleSidebar} aria-label="Toggle sidebar">
				<PiDotsSixBold className="h-4 w-4" />
			</Button>
		</SidebarHeader>
	)
}