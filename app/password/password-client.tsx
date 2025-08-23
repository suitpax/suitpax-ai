"use client"

import React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import VantaHaloBackground from "@/components/ui/vanta-halo-background"
import CityAnimateText from "@/components/ui/city-animate-text"
import MiniCountdownBadge from "@/components/ui/mini-countdown"
import { z } from "zod"
import { SmallSessionLoader } from "@/components/ui/loaders"
import dynamic from "next/dynamic"
const AirlinesSlider = dynamic(() => import("@/components/flights/results/airlines-slider"), { ssr: false })

export default function PasswordGatePageClient() {
	const router = useRouter()
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [headline, setHeadline] = useState("Suitpax AI: Build. Travel. Code.")
	const [contactEmail, setContactEmail] = useState("")
	const [contactCompany, setContactCompany] = useState("")
	const [contactMessage, setContactMessage] = useState("")
	const [contactMsg, setContactMsg] = useState<string | null>(null)
	const [contactLoading, setContactLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	// Temporarily return a minimal wrapper to unblock build
	return <div className="min-h-screen bg-[#eaf2ff]"></div>
}