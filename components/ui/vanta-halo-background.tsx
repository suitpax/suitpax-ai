"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    THREE: any
    VANTA: any
  }
}

export default function VantaHaloBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    if (!vantaRef.current) return

    const loadVanta = async () => {
      // Load THREE.js
      if (!window.THREE) {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      // Load Vanta Halo
      if (!window.VANTA?.HALO) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      // Initialize Vanta effect
      if (window.VANTA?.HALO && vantaRef.current) {
        vantaEffect.current = window.VANTA.HALO({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          backgroundColor: 0xe4e5ed,
          baseColor: 0xd2d3d7,
          size: 0.8,
          amplitudeFactor: 1.0,
        })
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
    }
  }, [])

  return <div ref={vantaRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />
}
