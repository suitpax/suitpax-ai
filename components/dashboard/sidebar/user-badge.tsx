"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export default function UserBadgeSidebar({ className }: { className?: string }) {
	const [profile, setProfile] = useState<any>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const supabase = createClient()
				const { data: { user } } = await supabase.auth.getUser()
				if (!user) return
				const { data: p } = await supabase
					.from("profiles")
					.select("full_name, company_name, job_title, avatar_url, plan")
					.eq("id", user.id)
					.single()
				setProfile(p)
			} catch {}
		}
		run()
	}, [])

	return (
		<div className={cn("rounded-xl border border-gray-200 bg-white/80 p-3 flex items-center gap-3", className)}>
			{profile?.avatar_url ? (
				<Image src={profile.avatar_url} alt="avatar" width={32} height={32} className="h-8 w-8 rounded-full border border-gray-200" />
			) : (
				<div className="h-8 w-8 rounded-full border border-gray-200 bg-gray-100" />
			)}
			<div className="min-w-0">
				<div className="text-[12px] font-medium text-gray-900 truncate">{profile?.full_name || "User"}</div>
				<div className="text-[11px] text-gray-600 truncate">{profile?.job_title || ""}{profile?.company_name ? (profile?.job_title ? ` · ${profile.company_name}` : profile.company_name) : ""}</div>
			</div>
			<span className="ml-auto rounded-md bg-gray-900 text-white text-[10px] px-1.5 py-[1px]">{(profile?.plan || "Free")}</span>
		</div>
	)
}