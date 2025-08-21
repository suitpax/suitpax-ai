"use client"

import { SidebarMenu } from "@/components/ui/primitives/sidebar"
import GlobalPromptInput from "@/components/dashboard/global-prompt-input"
import NavigationSection from "./sections/navigation"

export default function DashboardSidebarContent({ isCollapsed, isMobile, onCloseMobile }: { isCollapsed?: boolean; isMobile?: boolean; onCloseMobile?: () => void }) {
	return (
		<SidebarMenu>
			{!isCollapsed && (
				<div className="px-3 pb-2">
					<GlobalPromptInput className="bg-white/80 border border-gray-200" placeholder="Ask the AI to plan a trip…" />
				</div>
			)}
			<NavigationSection isCollapsed={isCollapsed} isMobile={isMobile} onCloseMobile={onCloseMobile} />
		</SidebarMenu>
	)
}