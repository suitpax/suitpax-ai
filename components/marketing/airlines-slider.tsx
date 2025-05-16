"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Image from "next/image"

const AirlinesSlider = () => {
  const sliderTopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const animateSlider = (sliderRef: React.RefObject<HTMLDivElement>, speed: number, reverse = false) => {
      const slider = sliderRef.current
      if (!slider) return

      let animationId: number
      let position = 0

      const animate = () => {
        position += reverse ? speed : -speed

        // Reset position for seamless loop
        const contentWidth = slider.scrollWidth
        const viewportWidth = slider.clientWidth

        if (Math.abs(position) >= contentWidth - viewportWidth) {
          position = 0
        }

        if (slider.querySelector(".slider-content")) {
          ;(slider.querySelector(".slider-content") as HTMLElement).style.transform = `translateX(${position}px)`
        }

        animationId = requestAnimationFrame(animate)
      }

      animationId = requestAnimationFrame(animate)

      return () => {
        cancelAnimationFrame(animationId)
      }
    }

    const cleanupTop = animateSlider(sliderTopRef, 0.5)

    return () => {
      cleanupTop && cleanupTop()
    }
  }, [])

  const airlines = [
    {
      name: "American Airlines",
      logo: "https://cdn.brandfetch.io/aa.com/w/512/h/78/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "KLM Royal Dutch Airlines",
      logo: "https://cdn.brandfetch.io/klm.com/w/512/h/69/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "Japan Airlines",
      logo: "https://cdn.brandfetch.io/jal.com/w/512/h/49/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "Qatar Airways",
      logo: "https://cdn.brandfetch.io/qatarairways.com/w/512/h/144/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "British Airways",
      logo: "https://cdn.brandfetch.io/britishairways.com/w/512/h/80/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "SAS Scandinavian Airlines",
      logo: "https://cdn.brandfetch.io/flysas.com/w/512/h/180/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "Southwest Airlines",
      logo: "https://cdn.brandfetch.io/southwest.com/w/512/h/78/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "Iberia",
      logo: "https://cdn.brandfetch.io/iberia.com/w/512/h/114/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "Air Canada",
      logo: "https://cdn.brandfetch.io/aircanada.com/w/512/h/67/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "JetBlue",
      logo: "https://cdn.brandfetch.io/jetblue.com/w/512/h/169/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
    {
      name: "Emirates",
      logo: "https://cdn.brandfetch.io/emirates.com/w/512/h/95/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    },
  
  ]

  // Duplicate the airlines array multiple times to create a seamless infinite loop
  const duplicatedAirlines = [...airlines, ...airlines, ...airlines, ...airlines]

  return (
    <div className="w-full overflow-hidden bg-black/40 backdrop-blur-sm rounded-xl">
      {/* Single row */}
      <div className="py-6 relative overflow-hidden" ref={sliderTopRef}>
        <div className="flex slider-content">
          {duplicatedAirlines.map((airline, index) => (
            <div
              key={`airline-${airline.name}-${index}`}
              className="flex-shrink-0 mx-5 opacity-60 hover:opacity-100 transition-opacity duration-300"
              style={{ width: "100px" }}
            >
              <Image
                src={airline.logo || "/placeholder.svg"}
                alt={airline.name}
                width={100}
                height={40}
                className="h-6 w-auto object-contain invert brightness-0 filter"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AirlinesSlider
