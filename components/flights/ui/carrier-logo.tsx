"use client"

import Image from "next/image"

interface CarrierLogoProps {
  iata?: string
  name?: string
  className?: string
  width?: number
  height?: number
  lockup?: boolean
}

export default function CarrierLogo({ iata, name, className = "", width = 32, height = 32, lockup = false }: CarrierLogoProps) {
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
    />
  )
}

