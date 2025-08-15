"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface SoftHeroProps {
	eyebrow?: string
	title: React.ReactNode
	description?: string
	primaryCta?: { label: string; href?: string }
	secondaryCta?: { label: string; href?: string }
	className?: string
}

export default function SoftHero({ eyebrow, title, description, primaryCta, secondaryCta, className = "" }: SoftHeroProps) {
	return (
		<section className={`relative overflow-hidden py-12 md:py-16 lg:py-20 ${className}`}>
			{/* Soft spotlight background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-200" />
				<div className="absolute inset-0 opacity-60 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(0,0,0,0.08),transparent_60%)]" />
				<div className="absolute inset-0 opacity-50 bg-[radial-gradient(900px_500px_at_80%_70%,rgba(0,0,0,0.06),transparent_60%)]" />
			</div>

			<div className="max-w-6xl mx-auto px-4">
				<div className="max-w-3xl">
					{eyebrow && (
						<div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm px-2.5 py-1 text-xs text-gray-700">
							<span>{eyebrow}</span>
							<span className="inline-flex items-center justify-center w-5 h-5 rounded-xl overflow-hidden border border-gray-200">
								<Image src="/agents/agent-2.png" alt="Demo" width={20} height={20} className="object-cover" />
							</span>
						</div>
					)}

					<motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-4 text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-gray-900">
						{title}
					</motion.h1>

					{description && (
						<p className="mt-4 text-sm md:text-base text-gray-600 max-w-xl">{description}</p>
					)}

					<div className="mt-6 flex items-center gap-3">
						{primaryCta && (
							<Link href={primaryCta.href || "#"} className="inline-flex items-center rounded-xl bg-gray-900 text-white px-4 py-2 text-xs md:text-sm hover:bg-black">
								{primaryCta.label}
							</Link>
						)}
						{secondaryCta && (
							<Link href={secondaryCta.href || "#"} className="inline-flex items-center rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm text-gray-900 px-4 py-2 text-xs md:text-sm hover:bg-gray-50">
								{secondaryCta.label}
							</Link>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}