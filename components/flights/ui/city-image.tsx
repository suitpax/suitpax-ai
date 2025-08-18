"use client"

import Image from "next/image"
import { resolveCityImage } from "@/lib/utils"

interface CityImageProps {
  city?: string
  className?: string
  sizes?: string
  width?: number
  height?: number
}

export default function CityImage({ city, className = "", sizes = "100vw", width = 640, height = 400 }: CityImageProps) {
  const src = resolveCityImage(city || "city", { width, height, preferCdn: false, preferUnsplash: true })
  return <Image src={src} alt={city || "city"} fill sizes={sizes} className={className || "object-cover"} />
}

