"use client"

export default function VantaClouds2Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100" />

      {/* Animated cloud-like elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute top-32 right-20 w-24 h-24 bg-blue-100/40 rounded-full blur-2xl animate-bounce"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-40 h-40 bg-sky-100/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-32 right-1/3 w-28 h-28 bg-white/40 rounded-full blur-2xl animate-bounce"
        style={{ animationDelay: "3s" }}
      />

      {/* Additional floating elements */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-radial from-blue-100/20 to-transparent rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
    </div>
  )
}
