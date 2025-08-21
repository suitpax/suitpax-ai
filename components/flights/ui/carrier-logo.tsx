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
	src?: string
}

export default function CarrierLogo({ iata, name, className = "", width = 20, height = 20, lockup = false, noFallback = false, src }: CarrierLogoProps) {
	if (!iata && !src) return null
	const base = 'https://assets.duffel.com/img/airlines/for-light-background'
	const path = lockup ? 'full-color-lockup' : 'symbol'
	const computedSrc = src || (iata ? `${base}/${path}/${iata}.svg` : "")
	return (
		<Image
			src={computedSrc}
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