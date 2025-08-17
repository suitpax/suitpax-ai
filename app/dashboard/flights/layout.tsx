"use client"

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}