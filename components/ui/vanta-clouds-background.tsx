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
        // Colores personalizados para un fondo más neutro y gris
        backgroundColor: 0xf5f5f5, // Gris muy claro para el fondo
        skyColor: 0xc7e5f2,
        cloudColor: 0xe5e7eb, // Gray-200 para las nubes
        cloudShadowColor: 0x9ca3af, // Gray-400 para las sombras de las nubes
        sunColor: 0x000000, // Eliminando el sol (negro sin opacidad)
        sunGlareColor: 0x000000, // Eliminando el resplandor del sol
        sunlightColor: 0x000000, // Eliminando la luz del sol
        speed: 1,
        sunPosition: [0, -100, 0], // Posicionando el sol muy abajo para que no sea visible
        sunIntensity: 0, // Intensidad del sol a 0
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
