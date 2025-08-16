"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const Countdown = () => {
	const launchDate = new Date("2026-01-15T00:00:00")
	const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
	useEffect(() => {
		const tick = () => {
			const now = new Date()
			const diff = launchDate.getTime() - now.getTime()
			if (diff > 0) {
				setTimeLeft({
					days: Math.floor(diff / (1000 * 60 * 60 * 24)),
					hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((diff / 1000 / 60) % 60),
					seconds: Math.floor((diff / 1000) % 60),
				})
			}
		}
		tick()
		const t = setInterval(tick, 1000)
		return () => clearInterval(t)
	}, [])
	return (
		<div className="mt-6 inline-flex items-center gap-4 text-gray-600">
			<div className="flex flex-col items-center">
				<div className="text-2xl font-medium text-gray-900">{timeLeft.days}</div>
				<div className="text-[10px] uppercase tracking-wide">Days</div>
			</div>
			<div className="text-lg">:</div>
			<div className="flex flex-col items-center">
				<div className="text-2xl font-medium text-gray-900">{timeLeft.hours}</div>
				<div className="text-[10px] uppercase tracking-wide">Hours</div>
			</div>
			<div className="text-lg">:</div>
			<div className="flex flex-col items-center">
				<div className="text-2xl font-medium text-gray-900">{timeLeft.minutes}</div>
				<div className="text-[10px] uppercase tracking-wide">Minutes</div>
			</div>
			<div className="text-lg">:</div>
			<div className="flex flex-col items-center">
				<div className="text-2xl font-medium text-gray-900">{timeLeft.seconds}</div>
				<div className="text-[10px] uppercase tracking-wide">Seconds</div>
			</div>
		</div>
	)
}

const AgentMiniBlock = () => {
	const [agentSrc, setAgentSrc] = useState("/agents/agent-emma.jpeg")
	const [videoSrc, setVideoSrc] = useState<string | null>(null)
	useEffect(() => {
		const pool = [
			"/agents/agent-emma.jpeg",
			"/agents/agent-marcus.jpeg",
			"/agents/agent-sophia.jpeg",
			"/agents/agent-alex.jpeg",
		]
		setAgentSrc(pool[Math.floor(Math.random() * pool.length)])
		// sample agent video from existing assets
		setVideoSrc("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372671794094522374%20%281%29-mXhXqJuzE8yRQG72P48PBvFH1FNb7X.mp4")
	}, [])
	return (
		<div className="w-full max-w-xl mx-auto bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-2 shadow-sm">
			<div className="flex items-center gap-3">
				<div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
					{videoSrc ? (
						<video className="w-full h-full object-cover" autoPlay muted loop playsInline>
							<source src={videoSrc} type="video/mp4" />
						</video>
					) : (
						<Image src={agentSrc} alt="AI Agent" width={48} height={48} className="w-full h-full object-cover" />
					)}
					<div className="absolute -top-1 -right-1 flex items-center gap-1">
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:150ms]"></span>
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:300ms]"></span>
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<div className="text-[11px] text-gray-500">Suitpax Code Agent</div>
					<div className="text-sm font-medium text-gray-900 truncate">Build a UI for a travel policy editor in React</div>
				</div>
			</div>
			<div className="mt-2 flex items-center gap-2">
				<div className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
					<span className="text-gray-400">Prompt</span>: Create a minimal settings panel with tabs for Company, Policies, and Approvals
				</div>
				<div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">▶︎ 00:12</div>
			</div>
		</div>
	)
}

export const LaunchHero = () => {
	return (
		<section className="w-full bg-white py-16 sm:py-20 relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gray-100 blur-3xl" />
				<div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gray-100 blur-3xl" />
			</div>
			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-5xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
						<span className="text-[10px] font-medium text-gray-700">Suitpax Code</span>
						<span className="text-[10px] text-gray-500">Private preview</span>
					</div>
					<h1 className="mt-4 text-4xl sm:text-5xl tracking-tight text-gray-900">
						<span className="font-serif italic">Build</span> faster with <span className="font-medium">Suitpax Code</span>
					</h1>
					<p className="mt-3 text-lg text-gray-600 font-medium max-w-3xl mx-auto">
						Create production-grade UIs, tools, and dashboards in minutes. Collaborate with AI agents that understand your
						business and your stack.
					</p>
					<div className="mt-4">
						<Countdown />
					</div>
					<div className="mt-8">
						<AgentMiniBlock />
					</div>
					<div className="mt-8 flex items-center justify-center gap-3">
						<a href="/pricing#code" className="rounded-xl border border-black bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">Join waitlist</a>
						<a href="/dashboard/code" className="rounded-xl border border-gray-300 bg-white text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">See preview</a>
					</div>
					<div className="mt-6 text-[11px] text-gray-500">Custom pricing planned Q1 2026</div>
				</div>
			</div>
		</section>
	)
}

export default LaunchHero
