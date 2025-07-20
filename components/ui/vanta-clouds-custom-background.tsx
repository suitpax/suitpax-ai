"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface VantaCloudsCustomBackgroundProps {
  children: React.ReactNode
  className?: string
}

export default function VantaCloudsCustomBackground({ children, className = "" }: VantaCloudsCustomBackgroundProps) {
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

        // Colores personalizados según especificaciones
        backgroundColor: 0xffffff,
        skyColor: 0x68b8d7,
        cloudColor: 0xadc1de,
        cloudShadowColor: 0x183550,
        sunColor: 0xff9919,
        sunGlareColor: 0xff6633,
        sunlightColor: 0xff9933,
        speed: 1,
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
