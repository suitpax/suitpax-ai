"use client"

import type React from "react"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    VANTA: any
    THREE: any
  }
}

interface VantaCloudsBackgroundProps {
  children: React.ReactNode
  className?: string
}

export default function VantaCloudsBackground({ children, className = "" }: VantaCloudsBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    const loadVanta = async () => {
      if (typeof window !== "undefined" && vantaRef.current) {
        // Load THREE.js
        if (!window.THREE) {
          const threeScript = document.createElement("script")
          threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          document.head.appendChild(threeScript)

          await new Promise((resolve) => {
            threeScript.onload = resolve
          })
        }

        // Load Vanta Clouds
        if (!window.VANTA?.CLOUDS) {
          const vantaScript = document.createElement("script")
          vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js"
          document.head.appendChild(vantaScript)

          await new Promise((resolve) => {
            vantaScript.onload = resolve
          })
        }

        // Initialize Vanta effect
        if (window.VANTA?.CLOUDS && vantaRef.current) {
          vantaEffect.current = window.VANTA.CLOUDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            backgroundColor: 0x87ceeb, // Sky blue
            skyColor: 0x4a90e2, // Bright blue
            cloudColor: 0xffffff, // Pure white
            cloudShadowColor: 0xe6f3ff, // Light blue shadow
            sunColor: 0xffd700, // Golden sun
            sunGlareColor: 0xffeb3b, // Sun glare
            sunlightColor: 0xffffff, // White sunlight
            speed: 0.8,
            cloudOpacity: 0.8,
            scale: 1.0,
            scaleMobile: 1.0,
          })
        }
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
    }
  }, [])

  return (
    <div ref={vantaRef} className={`relative ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
