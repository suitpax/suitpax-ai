"use client"

import { useEffect, useMemo, useRef, useState } from "react"

export type ResponseStreamMode = "typewriter" | "instant"

interface ResponseStreamProps {
  textStream: string | (() => AsyncGenerator<string> | Promise<AsyncGenerator<string>>)
  mode?: ResponseStreamMode
  speed?: number
  as?: keyof JSX.IntrinsicElements
  className?: string
  onComplete?: () => void
}

export function ResponseStream({
  textStream,
  mode = "typewriter",
  speed = 20,
  as = "div",
  className,
  onComplete,
}: ResponseStreamProps) {
  const [text, setText] = useState("")
  const [isDone, setIsDone] = useState(false)
  const rafRef = useRef<number | null>(null)
  const Element = as as any

  // Resolve to a full string if a generator is provided by collecting tokens
  const fullTextPromise = useMemo(() => {
    if (typeof textStream === "string") return Promise.resolve(textStream)
    const getGen = typeof textStream === "function" ? textStream : null
    if (!getGen) return Promise.resolve("")
    return (async () => {
      const gen = await getGen()
      let acc = ""
      for await (const chunk of gen) {
        acc += chunk
      }
      return acc
    })()
  }, [textStream])

  useEffect(() => {
    let cancelled = false

    const typeText = async (content: string) => {
      if (mode === "instant") {
        setText(content)
        setIsDone(true)
        onComplete?.()
        return
      }

      let index = 0
      const step = () => {
        if (cancelled) return
        index = Math.min(index + 1, content.length)
        setText(content.slice(0, index))
        if (index < content.length) {
          rafRef.current = window.setTimeout(step, Math.max(1, speed)) as unknown as number
        } else {
          setIsDone(true)
          onComplete?.()
        }
      }
      step()
    }

    fullTextPromise.then((content) => {
      if (!cancelled) typeText(content)
    })

    return () => {
      cancelled = true
      if (rafRef.current) window.clearTimeout(rafRef.current)
    }
  }, [fullTextPromise, mode, speed, onComplete])

  return <Element className={className}>{text}</Element>
}

export default ResponseStream