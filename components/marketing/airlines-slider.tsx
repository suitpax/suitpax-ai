"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const AirlinesSlider = () => {
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

    const cardWidth = 120
    const gap = 32
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
      <div className="w-full overflow-hidden bg-gray-100 rounded-2xl border border-gray-200">
        <div className="py-10 h-20" />
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-gray-100 rounded-2xl border border-gray-200">
      <div className="py-8 relative overflow-hidden" ref={sliderRef}>
        <div 
          ref={contentRef}
          className="flex"
          style={{ willChange: 'transform' }}
        >
          {duplicatedAirlines.map((airline, index) => (
            <div
              key={`airline-${airline.name}-${index}`}
              className="flex-shrink-0 mx-4 group"
              style={{ width: "120px" }}
              title={airline.name}
            >
              <div className="relative h-10 flex items-center justify-center rounded-lg bg-white/70 border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src={airline.logo || "/placeholder.svg"}
                  alt={airline.name}
                  width={120}
                  height={40}
                  className="h-6 w-auto object-contain invert-[0.8] saturate-0 contrast-150"
                  priority={index < airlines.length}
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                />
              </div>
              <div className="mt-2 text-center">
                <span className="text-[10px] text-gray-600 font-medium line-clamp-1">{airline.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AirlinesSlider
