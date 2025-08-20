"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

type AirlinesSliderProps = { variant?: "light" | "dark"; showHeader?: boolean }

const AirlinesSlider = ({ variant = "light", showHeader = true }: AirlinesSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const slider = sliderRef.current
    const content = contentRef.current
    
    if (!slider || !content) return

    let animationId: number
    let position = 0
    const speed = 0.6

    const cardWidth = 72
    const gap = 20
    const singleSetWidth = (cardWidth + gap) * airlines.length

    const animate = () => {
      position -= speed
      if (Math.abs(position) >= singleSetWidth) position = 0
      content.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    const timeoutId = setTimeout(() => { animationId = requestAnimationFrame(animate) }, 80)

    return () => {
      clearTimeout(timeoutId)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isClient])

  const airlines = [
    { name: "American Airlines", logo: "https://cdn.brandfetch.io/aa.com/w/512/h/78/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "KLM Royal Dutch Airlines", logo: "https://cdn.brandfetch.io/klm.com/w/512/h/69/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "Japan Airlines", logo: "https://cdn.brandfetch.io/jal.com/w/512/h/49/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "Qatar Airways", logo: "https://cdn.brandfetch.io/qatarairways.com/w/512/h/144/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "British Airways", logo: "https://cdn.brandfetch.io/britishairways.com/w/512/h/80/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "SAS Scandinavian Airlines", logo: "https://cdn.brandfetch.io/flysas.com/w/512/h/180/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "Southwest Airlines", logo: "https://cdn.brandfetch.io/southwest.com/w/512/h/78/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "Iberia", logo: "https://cdn.brandfetch.io/iberia.com/w/512/h/114/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "Air Canada", logo: "https://cdn.brandfetch.io/aircanada.com/w/512/h/67/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "JetBlue", logo: "https://cdn.brandfetch.io/jetblue.com/w/512/h/169/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "Emirates", logo: "https://cdn.brandfetch.io/emirates.com/w/512/h/95/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
    { name: "Vueling", logo: "https://cdn.brandfetch.io/vueling.com/w/512/h/169/logo?c=1idU-l8vdm7C5__3dci" },
  ]

  const duplicatedAirlines = [...airlines, ...airlines, ...airlines]

  if (!isClient) {
    return (
      <div className={
        "w-full overflow-hidden rounded-2xl " +
        (variant === "dark" ? "bg-transparent border border-transparent" : "bg-gray-100 border border-gray-200")
      }>
        {showHeader && (
          <div className={
            "px-4 pt-4 text-center " +
            (variant === "dark" ? "text-white" : "text-gray-900")
          }>
            <div className={
              (variant === "dark"
                ? "inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[9px] font-medium text-white border border-white/20 mb-1.5"
                : "inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700 mb-1.5")
            }>
              <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={14} height={14} className="mr-1 h-3 w-auto" />
              Airline Partners
            </div>
            <h3 className={variant === "dark" ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-900"}>Connected with leading airlines</h3>
            <p className={variant === "dark" ? "text-[10px] text-white/70 mt-1" : "text-[10px] text-gray-600 mt-1"}>Direct integrations for faster, more reliable bookings</p>
          </div>
        )}
        <div className="py-6 h-16" />
      </div>
    )
  }

  return (
    <div className={
      "w-full overflow-hidden rounded-2xl " +
      (variant === "dark" ? "bg-transparent border border-transparent" : "bg-gray-100 border border-gray-200")
    }>
      {showHeader && (
        <div className="px-4 pt-4 text-center">
          <div className={
            variant === "dark"
              ? "inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[9px] font-medium text-white border border-white/20 mb-1.5"
              : "inline-flex items-center rounded-xl bg-gray-200 px-2 py-0.5 text-[9px] font-medium text-gray-700 mb-1.5"
          }>
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={14} height={14} className="mr-1 h-3 w-auto" />
            Airline Partners
          </div>
          <h3 className={variant === "dark" ? "text-sm sm:text-base font-medium text-white" : "text-sm sm:text-base font-medium text-gray-900"}>Connected with leading airlines</h3>
          <p className={variant === "dark" ? "text-[10px] sm:text-xs text-white/70 mt-1" : "text-[10px] sm:text-xs text-gray-600 mt-1"}>Direct integrations for faster, more reliable bookings</p>
        </div>
      )}
      <div className="py-5 relative overflow-hidden" ref={sliderRef}>
        <div 
          ref={contentRef}
          className="flex"
          style={{ willChange: 'transform' }}
        >
          {duplicatedAirlines.map((airline, index) => (
            <div
              key={`airline-${airline.name}-${index}`}
              className="flex-shrink-0 mx-2.5 group"
              style={{ width: "72px" }}
              title={airline.name}
            >
              <div className={
                variant === "dark"
                  ? "relative h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/15 shadow-sm group-hover:shadow-md transition-shadow"
                  : "relative h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
              }>
                <Image
                  src={airline.logo || "/placeholder.svg"}
                  alt={airline.name}
                  width={72}
                  height={28}
                  className={
                    variant === "dark"
                      ? "h-3.5 w-auto object-contain"
                      : "h-3.5 w-auto object-contain"
                  }
                  priority={index < airlines.length}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                />
              </div>
              <div className="mt-1.5 text-center">
                <span className={variant === "dark" ? "text-[8px] text-white/70 font-medium line-clamp-1" : "text-[8px] text-gray-600 font-medium line-clamp-1"}>{airline.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AirlinesSlider
