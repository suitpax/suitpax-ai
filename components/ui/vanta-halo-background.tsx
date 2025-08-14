"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import Script from "next/script"

interface VantaHaloBackgroundProps {
  children: React.ReactNode
  className?: string
}

export default function VantaHaloBackground({ children, className = "" }: VantaHaloBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    if (!scriptsLoaded || !vantaRef.current) return

    // Solo inicializar si no existe ya
    if (!vantaEffect) {
      // @ts-ignore - Vanta se carga globalmente
      const effect = window.VANTA.HALO({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        backgroundColor: 0xf7f7f9,
        baseColor: 0xe3e4e8,
        size: 0.8,
        amplitudeFactor: 1,
        xOffset: 0,
        yOffset: 0,
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
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js" />

      <div ref={vantaRef} className={`${className}`}>
        {children}
      </div>
    </>
  )
}
