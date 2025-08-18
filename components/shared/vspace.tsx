"use client"

interface VSpaceProps { size?: number }
export default function VSpace({ size = 8 }: VSpaceProps) {
  return <div style={{ height: size }} />
}

