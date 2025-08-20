"use client"

import * as React from "react"

type LoaderSize = "sm" | "md" | "lg"
type LoaderVariant =
  | "circular"
  | "classic"
  | "pulse"
  | "pulse-dot"
  | "dots"
  | "typing"
  | "wave"
  | "bars"
  | "terminal"
  | "text-blink"
  | "text-shimmer"
  | "loading-dots"

export interface LoaderProps {
  variant?: LoaderVariant
  size?: LoaderSize
  className?: string
  label?: string
}

const sizeToPx: Record<LoaderSize, number> = { sm: 16, md: 24, lg: 36 }
const dotSizeToPx: Record<LoaderSize, number> = { sm: 4, md: 6, lg: 8 }

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ")
}

export function Loader({ variant = "circular", size = "md", className, label }: LoaderProps) {
  const px = sizeToPx[size]
  const dotPx = dotSizeToPx[size]

  if (variant === "circular") {
    return (
      <div className={classNames("inline-flex items-center gap-2", className)} aria-label={label || "Loading"}>
        <div
          className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
          style={{ width: px, height: px }}
        />
      </div>
    )
  }

  if (variant === "classic") {
    return (
      <div className={classNames("inline-flex items-center gap-1", className)} aria-label={label || "Loading"}>
        <div className="h-[3px] w-5 animate-pulse rounded bg-gray-900" />
        <div className="h-[3px] w-3 animate-pulse rounded bg-gray-500 [animation-delay:120ms]" />
        <div className="h-[3px] w-2 animate-pulse rounded bg-gray-300 [animation-delay:240ms]" />
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div
        className={classNames("inline-block animate-pulse rounded-full bg-gray-900", className)}
        style={{ width: px, height: px }}
        aria-label={label || "Loading"}
      />
    )
  }

  if (variant === "pulse-dot") {
    return (
      <div className={classNames("inline-flex items-center gap-1", className)} aria-label={label || "Loading"}>
        <span
          className="inline-block animate-pulse rounded-full bg-gray-900"
          style={{ width: dotPx, height: dotPx }}
        />
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={classNames("inline-flex items-center gap-1", className)} aria-label={label || "Loading"}>
        <span className="inline-block animate-bounce rounded-full bg-gray-900" style={{ width: dotPx, height: dotPx }} />
        <span className="inline-block animate-bounce rounded-full bg-gray-900 [animation-delay:120ms]" style={{ width: dotPx, height: dotPx }} />
        <span className="inline-block animate-bounce rounded-full bg-gray-900 [animation-delay:240ms]" style={{ width: dotPx, height: dotPx }} />
      </div>
    )
  }

  if (variant === "typing") {
    return (
      <div className={classNames("inline-flex items-end gap-[2px]", className)} aria-label={label || "Typing"}>
        <span className="h-[2px] w-[2px] animate-[ping_1s_linear_infinite] rounded-full bg-gray-900" />
        <span className="h-[2px] w-[2px] animate-[ping_1s_linear_infinite] rounded-full bg-gray-900 [animation-delay:150ms]" />
        <span className="h-[2px] w-[2px] animate-[ping_1s_linear_infinite] rounded-full bg-gray-900 [animation-delay:300ms]" />
      </div>
    )
  }

  if (variant === "wave") {
    const barW = Math.max(2, Math.round(px / 6))
    const barH = Math.max(10, Math.round(px * 1.2))
    return (
      <div className={classNames("inline-flex items-end gap-[2px]", className)} aria-label={label || "Loading"}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="inline-block animate-[wave_1s_ease-in-out_infinite] bg-gray-900"
            style={{ width: barW, height: barH, animationDelay: `${i * 120}ms` }}
          />
        ))}
        <style>{`@keyframes wave { 0%, 100% { transform: scaleY(0.4) } 50% { transform: scaleY(1) } }`}</style>
      </div>
    )
  }

  if (variant === "bars") {
    const barW = Math.max(3, Math.round(px / 5))
    return (
      <div className={classNames("inline-flex items-end gap-[3px]", className)} aria-label={label || "Loading"}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="inline-block bg-gray-900"
            style={{ width: barW, height: (i + 2) * 4 }}
          />
        ))}
      </div>
    )
  }

  if (variant === "terminal") {
    return (
      <div className={classNames("inline-flex items-center font-mono text-sm text-gray-800", className)}>
        <span>$</span>
        <span className="mx-1">_</span>
        <span className="ml-1 inline-block h-4 w-[1px] animate-pulse bg-gray-800" />
      </div>
    )
  }

  if (variant === "text-blink") {
    return (
      <span className={classNames("inline-block animate-pulse text-sm text-gray-700", className)}>Loading…</span>
    )
  }

  if (variant === "text-shimmer") {
    return (
      <span
        className={classNames(
          "inline-block bg-[linear-gradient(110deg,#e5e7eb,45%,#f3f4f6,55%,#e5e7eb)] bg-[length:200%_100%] text-transparent [background-clip:text] animate-[shimmer_1.2s_infinite]",
          className,
        )}
      >
        Loading…
        <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
      </span>
    )
  }

  if (variant === "loading-dots") {
    return (
      <span className={classNames("inline-flex items-center text-sm text-gray-700", className)}>
        Loading
        <span className="ml-1 inline-flex items-center">
          <span className="animate-bounce [animation-delay:0ms]">.</span>
          <span className="animate-bounce [animation-delay:120ms]">.</span>
          <span className="animate-bounce [animation-delay:240ms]">.</span>
        </span>
      </span>
    )
  }

  return null
}

export default Loader

