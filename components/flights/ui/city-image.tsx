"use client"

import Image from "next/image"
import { resolveCityImage } from "@/lib/utils"

interface CityImageProps {
  city?: string
  className?: string
  sizes?: string
  width?: number
  height?: number
  unoptimized?: boolean
}

export default function CityImage({ city, className = "", sizes = "100vw", width = 640, height = 400, unoptimized = true }: CityImageProps) {
  const src = resolveCityImage(city || "city", { width, height, preferCdn: false, preferPexels: true, preferUnsplash: false })
  return <Image src={src} alt={city || "city"} fill sizes={sizes} unoptimized={unoptimized} className={className || "object-cover"} />
}

