"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Plane, CheckSquare, Sparkles, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
	{ name: "Home", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Trips", href: "/dashboard/trips", icon: Plane },
	{ name: "Approvals", href: "/dashboard/approvals", icon: CheckSquare },
	{ name: "AI", href: "/dashboard/ai-center", icon: Sparkles },
	{ name: "Finance", href: "/dashboard/finance-hub", icon: CreditCard },
]

export default function MobileBottomNav() {
	const pathname = usePathname()

	return (
		<div className="lg:hidden">
			<nav
				className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-lg"
				style={{ WebkitBackdropFilter: "blur(12px)" }}
			>
				<ul className="flex items-center justify-between gap-1 px-2 py-1.5">
					{items.map((item) => {
						const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
						return (
							<li key={item.name} className="flex-1">
								<Link
									href={item.href}
									className={cn(
										"flex flex-col items-center justify-center rounded-xl px-3 py-2 transition-colors",
										isActive ? "bg-gray-900 text-white" : "text-gray-900 hover:bg-gray-100",
									)}
								>
									<item.icon className="h-5 w-5" />
									<span className="mt-0.5 text-[10px] font-medium">{item.name}</span>
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}