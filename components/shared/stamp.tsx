"use client"

interface StampProps { text: string }
export default function Stamp({ text }: StampProps) {
  return <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] bg-gray-100 text-gray-800 border border-gray-200">{text}</span>
}

