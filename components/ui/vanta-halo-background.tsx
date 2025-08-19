"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import Script from "next/script"

interface VantaHaloBackgroundProps {
  children: React.ReactNode
  className?: string
  options?: Partial<{
    backgroundColor: number
    baseColor: number
    color: number
    color2: number
    size: number
    amplitudeFactor: number
    xOffset: number
    yOffset: number
  }>
}

export default function VantaHaloBackground({ children, className = "", options = {} }: VantaHaloBackgroundProps) {
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
        backgroundColor: options.backgroundColor ?? 0xe4e5ed,
        baseColor: options.baseColor ?? 0xdfe3ea,
        size: options.size ?? 0.8,
        amplitudeFactor: options.amplitudeFactor ?? 1.0,
        xOffset: options.xOffset ?? 0,
        yOffset: options.yOffset ?? 0,
        color: options.color ?? 0xffffff,
        color2: options.color2 ?? 0xCFE8FF,
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
