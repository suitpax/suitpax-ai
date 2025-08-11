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
    const speed = 0.5

    const animate = () => {
      position -= speed
      
      // Calcular el ancho de un conjunto de aerolíneas (sin duplicados)
      const singleSetWidth = (100 + 40) * airlines.length // 100px width + 40px margin (mx-5 = 20px each side)
      
      // Reset cuando hemos movido exactamente un conjunto completo
      if (Math.abs(position) >= singleSetWidth) {
        position = 0
      }

      content.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isClient])

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
    {
      name: "Vueling",
      logo: "https://cdn.brandfetch.io/vueling.com/w/512/h/169/logo?c=1idU-l8vdm7C5__3dci",
    },
  ]

  // Duplicar para loop infinito - reducido a 3 copias para mejor rendimiento
  const duplicatedAirlines = [...airlines, ...airlines, ...airlines]

  if (!isClient) {
    return (
      <div className="w-full overflow-hidden bg-black/40 backdrop-blur-sm rounded-xl">
        <div className="py-6 h-16" />
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-black/40 backdrop-blur-sm rounded-xl">
      <div className="py-6 relative overflow-hidden" ref={sliderRef}>
        <div 
          ref={contentRef}
          className="flex"
          style={{ willChange: 'transform' }}
        >
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
                className="h-6 w-auto object-contain"
                priority={index < airlines.length} // Prioridad para el primer conjunto
                onError={(e) => {
                  // Fallback en caso de error de imagen
                  (e.target as HTMLImageElement).src = "/placeholder.svg"
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AirlinesSlider