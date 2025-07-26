"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Script from "next/script"

interface VantaHeroBackgroundProps {
  children: React.ReactNode
  className?: string
  backgroundColor?: number
  baseColor?: number
  size?: number
  amplitudeFactor?: number
}

export default function VantaHeroBackground({
  children,
  className = "",
  backgroundColor = 0xf3f4f6, // gray-100
  baseColor = 0xd1d5db, // gray-300
  size = 1.0,
  amplitudeFactor = 1.2,
}: VantaHeroBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    if (!scriptsLoaded || !vantaRef.current) return

    if (!vantaEffect) {
      // @ts-ignore - Vanta se carga globalmente
      const effect = window.VANTA.HALO({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        backgroundColor: backgroundColor,
        baseColor: baseColor,
        size: size,
        amplitudeFactor: amplitudeFactor,
        xOffset: 0.1,
        yOffset: 0.1,
      })

      setVantaEffect(effect)
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy()
        setVantaEffect(null)
      }
    }
  }, [vantaEffect, scriptsLoaded, backgroundColor, baseColor, size, amplitudeFactor])

  const handleScriptsLoad = () => {
    setScriptsLoaded(true)
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        onLoad={handleScriptsLoad}
        strategy="afterInteractive"
      />
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js" strategy="afterInteractive" />

      <div ref={vantaRef} className={`${className}`}>
        {children}
      </div>
    </>
  )
}
