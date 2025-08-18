"use client"

import Image from "next/image"

interface CarrierLogoProps {
  iata?: string
  name?: string
  className?: string
  width?: number
  height?: number
}

export default function CarrierLogo({ iata, name, className = "", width = 56, height = 22 }: CarrierLogoProps) {
  if (!iata) return null
  return (
    <Image
      src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${iata}.svg`}
      width={width}
      height={height}
      alt={name || iata}
      className={className}
    />
  )
}

