"use client"

interface HSpaceProps { size?: number }
export default function HSpace({ size = 8 }: HSpaceProps) {
  return <div style={{ width: size }} />
}

