"use client"

import { useEffect, useRef } from "react"
import CardForm from "./card-form"

// Example stub to show how a custom element wrapper could render into shadow DOM if needed
export default function CardFormCustomElement() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // In a real custom element scenario, mount into shadow root or listen to postMessage
  }, [])
  return (
    <div ref={ref} className="rounded-xl border border-gray-200 p-4 bg-white">
      <CardForm />
    </div>
  )
}

