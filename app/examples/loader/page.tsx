"use client"

import { useState } from "react"
import { Loader } from "@/components/prompt-kit/loader"
import { Button } from "@/components/ui/button"

export default function LoaderExamples() {
  const [size, setSize] = useState<"sm" | "md" | "lg">("md")
  const variants = [
    "circular",
    "classic",
    "pulse",
    "pulse-dot",
    "dots",
    "typing",
    "wave",
    "bars",
    "terminal",
    "text-blink",
    "text-shimmer",
    "loading-dots",
  ] as const

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Button size="sm" variant={size === "sm" ? "default" : "outline"} onClick={() => setSize("sm")}>
          Small
        </Button>
        <Button size="sm" variant={size === "md" ? "default" : "outline"} onClick={() => setSize("md")}>
          Medium
        </Button>
        <Button size="sm" variant={size === "lg" ? "default" : "outline"} onClick={() => setSize("lg")}>
          Large
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8 p-4 sm:grid-cols-3 md:grid-cols-4">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-col items-center justify-center gap-2 p-4">
            <Loader />
            <span className="text-muted-foreground text-sm">{variant}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

