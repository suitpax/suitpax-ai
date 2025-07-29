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
    <div ref={vantaRef} className={`relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 ${className}`}>
      {/* Main gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50" />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-50/30 to-sky-100/50" />

        {/* Floating cloud elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-40 bg-white/25 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-60 right-32 w-48 h-32 bg-sky-100/30 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-40 left-40 w-56 h-36 bg-blue-50/35 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          />
          <div
            className="absolute bottom-20 right-20 w-44 h-28 bg-white/30 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          {/* Central glow */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-blue-100/20 via-sky-50/15 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          />
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
