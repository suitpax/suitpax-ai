"use client"

import { useEffect, useState } from "react"
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Square } from "lucide-react"

export default function AgentCode() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [typed, setTyped] = useState("")
  const examples = [
    "Anything to Suitpax AI…",
    "Generate a minimal React UI for a policy editor…",
    "Create a travel dashboard with KPIs and filters…",
    "Build an expense anomaly detector component…",
  ]
  const [idx, setIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const text = examples[idx]
    let t: any
    if (!deleting && typed.length < text.length) {
      t = setTimeout(() => setTyped(text.slice(0, typed.length + 1)), 35)
    } else if (!deleting && typed === text) {
      t = setTimeout(() => setDeleting(true), 1300)
    } else if (deleting && typed.length > 0) {
      t = setTimeout(() => setTyped(text.slice(0, typed.length - 1)), 18)
    } else if (deleting && typed.length === 0) {
      setDeleting(false)
      setIdx((idx + 1) % examples.length)
    }
    return () => clearTimeout(t)
  }, [typed, deleting, idx, examples])

  const submit = () => {
    if (isLoading) return
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <section className="relative py-16 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-3 py-1">
            <span className="text-[10px] font-medium text-white">Suitpax Code</span>
            <span className="text-[10px] text-gray-300">Agent Interface</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tighter text-white">Ask. Build. Ship.</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-400 font-medium">
            Demonstrating the power of Suitpax AI to turn prompts into production-grade components and tools.
          </p>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-3 sm:p-4 shadow-lg">
            <PromptInput
              value={input}
              onValueChange={setInput}
              isLoading={isLoading}
              onSubmit={submit}
              className="bg-white border border-gray-200 p-2 sm:p-3"
            >
              <PromptInputTextarea placeholder={typed || "Anything to Suitpax AI…"} className="bg-white text-gray-900 placeholder:text-gray-500" />
              <PromptInputActions className="justify-end pt-2">
                <PromptInputAction tooltip={isLoading ? "Stop generation" : "Send message"}>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-black text-white hover:bg-gray-800"
                    onClick={submit}
                  >
                    {isLoading ? <Square className="size-5 fill-current" /> : <ArrowUp className="size-5" />}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
          </div>
        </div>
      </div>
    </section>
  )
}