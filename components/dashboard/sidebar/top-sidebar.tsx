"use client"

import { SidebarHeader, useSidebar } from "@/components/ui/primitives/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PiDotsSixBold } from "react-icons/pi"

export default function TopSidebar({ onToggle }: { onToggle?: () => void }) {
	const { toggleSidebar } = useSidebar()
	return (
		<SidebarHeader className="flex items-center justify-between bg-gray-100 px-4 border-b border-gray-100 py-2.5">
			<div className="flex items-center gap-3 min-w-0 pt-0.5">
				<Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={128} height={32} className="h-6 w-auto" />
			</div>
			<Button variant="ghost" size="sm" className="h-8 px-2 rounded-xl text-gray-700 hover:text-gray-900 mt-0.5" onClick={onToggle || toggleSidebar} aria-label="Toggle sidebar">
				<div className="flex items-center gap-1.5">
					<PiDotsSixBold className="h-4 w-4" />
					<span className="text-[10px] leading-none">Close</span>
				</div>
			</Button>
		</SidebarHeader>
	)
}