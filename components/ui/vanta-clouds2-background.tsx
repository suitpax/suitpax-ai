"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import Script from "next/script"

interface VantaClouds2BackgroundProps {
  children: React.ReactNode
  className?: string
}

export default function VantaClouds2Background({ children, className = "" }: VantaClouds2BackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    if (!scriptsLoaded || !vantaRef.current) return

    // Solo inicializar si no existe ya
    if (!vantaEffect) {
      // @ts-ignore - Vanta se carga globalmente
      const effect = window.VANTA.CLOUDS2({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,

        // Colores personalizados exactamente como especificados
        backgroundColor: 0x0, // Negro
        skyColor: 0x5ca6ca, // Azul claro
        cloudColor: 0x334d80, // Azul oscuro
        lightColor: 0xffffff, // Blanco
        speed: 1,

        // Usar una URL pública para la textura de ruido
        texturePath: "https://cdn.jsdelivr.net/gh/tengbao/vanta/dist/gallery/noise.png",
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
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds2.min.js" />

      <div ref={vantaRef} className={`${className}`}>
        {children}
      </div>
    </>
  )
}
