"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface VantaHaloCloudsBackgroundProps {
  className?: string
  children?: React.ReactNode
}

export default function VantaHaloCloudsBackground({ className, children }: VantaHaloCloudsBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    const loadVanta = async () => {
      if (typeof window !== "undefined" && vantaRef.current && mounted) {
        try {
          // Dynamically import Vanta and Three.js
          const [{ default: HALO }, { default: THREE }] = await Promise.all([
            import("vanta/dist/vanta.halo.min.js"),
            import("three"),
          ])

          // Cleanup any existing effect
          if (vantaEffect.current) {
            vantaEffect.current.destroy()
          }

          // Initialize Vanta effect with halo + clouds hybrid
          vantaEffect.current = HALO({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            baseColor: 0x0,
            backgroundColor: 0x0,
            amplitudeFactor: 1.0,
            xOffset: 0.0,
            yOffset: 0.0,
            size: 1.2,
          })
        } catch (error) {
          console.error("Error loading Vanta effect:", error)
        }
      }
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadVanta, 100)

    return () => {
      mounted = false
      clearTimeout(timer)
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy()
        } catch (error) {
          console.error("Error destroying Vanta effect:", error)
        }
      }
    }
  }, [])

  return (
    <div
      ref={vantaRef}
      className={cn("relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-800", className)}
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #2a2a2a 100%)",
      }}
    >
      {children}
    </div>
  )
}
