"use client"

import AIChat from "@/components/prompt-kit/response-stream" // we will wrap typing effect via provided component

export default function SuitpaxAI() {
  return (
    <div className="h-[100svh]">
      <AIChat />
    </div>
  )
}

