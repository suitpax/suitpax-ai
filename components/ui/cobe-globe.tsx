"use client"

import { useEffect, useRef } from "react"
import createGlobe from "cobe"

export function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let phi = 0
    let globe: any = null

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 800 * 2,
        height: 800 * 2,
        phi: 0,
        theta: 0.1,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 20000,
        mapBrightness: 6,
        baseColor: [0.1, 0.1, 0.15],
        markerColor: [0.1, 0.8, 1],
        glowColor: [0.1, 0.1, 0.15],
        markers: [
          { location: [37.75, -122.45], size: 0.03 },
          { location: [40.71, -74.0], size: 0.1 },
          { location: [51.5, -0.12], size: 0.1 },
          { location: [35.68, 139.76], size: 0.05 },
        ],
        onRender: (state) => {
          state.phi = phi
          phi += 0.005
        },
      })
    }

    return () => {
      if (globe) {
        globe.destroy()
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center w-full h-full opacity-70">
      <canvas ref={canvasRef} style={{ width: 800, height: 800, maxWidth: "100%", aspectRatio: 1 }} />
    </div>
  )
}
