"use client"

import { SidebarMenu } from "@/components/ui/primitives/sidebar"
import { NavigationSection } from "./sections"

export default function DashboardSidebarContent({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
	return (
		<SidebarMenu>
			<div className="px-3 py-2">
				{!isCollapsed && <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">Navigation</div>}
				<NavigationSection isCollapsed={isCollapsed} isMobile={isMobile} onCloseMobile={onCloseMobile} />
			</div>
			{!isCollapsed && (
				<div className="mt-2 px-3 pb-2">
					<div className="rounded-xl border border-gray-200 bg-white/80 p-2 text-[11px] text-gray-700">
						<div className="flex items-center justify-between">
							<span className="font-medium">Token usage</span>
							<span className="text-gray-500">Plan limits</span>
						</div>
						<div className="mt-1 text-[10px] text-gray-600">Flights searches: 0/100 • Price tracking: 0/20</div>
					</div>
				</div>
			)}
		</SidebarMenu>
	)
}