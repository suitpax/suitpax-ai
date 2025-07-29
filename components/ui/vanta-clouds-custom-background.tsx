"use client"

export default function VantaCloudsCustomBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-white" />

      {/* Cloud-like shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-16 left-16 w-48 h-32 bg-white/40 rounded-full blur-3xl transform rotate-12 animate-pulse" />
        <div
          className="absolute top-40 right-24 w-36 h-24 bg-sky-200/30 rounded-full blur-2xl transform -rotate-6 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-32 left-32 w-52 h-36 bg-blue-100/35 rounded-full blur-3xl transform rotate-45 animate-pulse"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute bottom-16 right-16 w-40 h-28 bg-white/45 rounded-full blur-2xl transform -rotate-12 animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Center focal point */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-radial from-sky-200/15 via-blue-100/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
      </div>
    </div>
  )
}
