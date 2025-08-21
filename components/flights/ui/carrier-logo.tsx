"use client"

import Image from "next/image"

interface CarrierLogoProps {
	iata?: string
	name?: string
	className?: string
	width?: number
	height?: number
	lockup?: boolean
	noFallback?: boolean
}

export default function CarrierLogo({ iata, name, className = "", width = 20, height = 20, lockup = false, noFallback = false }: CarrierLogoProps) {
	if (!iata) return null
	const base = 'https://assets.duffel.com/img/airlines/for-light-background'
	const path = lockup ? 'full-color-lockup' : 'symbol'
	return (
		<Image
			src={`${base}/${path}/${iata}.svg`}
			width={width}
			height={height}
			alt={name || iata}
			className={className}
			onError={(e) => {
				try {
					const el = e.target as HTMLImageElement
					if (noFallback) { el.style.display = 'none' }
					else { el.src = "/logo/suitpax-bl-logo.webp" }
				} catch {}
			}}
		/>
	)
}