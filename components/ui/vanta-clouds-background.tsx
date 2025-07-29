"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import Script from "next/script"

interface VantaCloudsBackgroundProps {
  children: React.ReactNode
  className?: string
}

export default function VantaCloudsBackground({ children, className = "" }: VantaCloudsBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    if (!scriptsLoaded || !vantaRef.current) return

    // Solo inicializar si no existe ya
    if (!vantaEffect) {
      // @ts-ignore - Vanta se carga globalmente
      const effect = window.VANTA.CLOUDS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        // Colores azul cielo más vibrantes
        backgroundColor: 0x87ceeb, // Sky blue
        skyColor: 0x4a90e2, // Bright blue sky
        cloudColor: 0xffffff, // Pure white clouds
        cloudShadowColor: 0xb0c4de, // Light steel blue for shadows
        sunColor: 0xffd700, // Golden sun
        sunGlareColor: 0xffffe0, // Light yellow glare
        sunlightColor: 0xfff8dc, // Cornsilk sunlight
        speed: 1.2,
        sunPosition: [0.2, 0.8, 0.5], // Position sun in upper area
        sunIntensity: 0.8, // Moderate sun intensity
      })

      setVantaEffect(effect)
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect, scriptsLoaded])

  const handleScriptsLoad = () => {
    setScriptsLoaded(true)
  }

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" onLoad={handleScriptsLoad} />
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js" />

      <div ref={vantaRef} className={`${className}`}>
        {children}
      </div>
    </>
  )
}
