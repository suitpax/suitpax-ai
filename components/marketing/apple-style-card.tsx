"use client"

import { useState } from "react"

export default function AppleStyleCard() {
  const [toast, setToast] = useState<{ id: number; message: string; visible: boolean; showIcon: boolean } | null>(null)

  const showToast = (message: string) => {
    const newToast = { id: Date.now(), message, visible: true, showIcon: false }
    setToast(newToast)
    setTimeout(() => setToast((prev) => (prev ? { ...prev, showIcon: true } : null)), 200)
    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false, showIcon: false } : null))
      setTimeout(() => setToast(null), 500)
    }, 2500)
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1">
            <span className="text-[10px] text-white font-medium">Suitpax</span>
            <span className="mx-2 h-3 w-px bg-white/20" />
            <span className="text-[10px] text-gray-300">AI Agent Showcase</span>
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tighter text-white">A new kind of assistant</h2>
          <p className="mt-2 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Designed with a focus on clarity and calm. Effortlessly helpful. Always there when you need it.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Glass card with video */}
          <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl">
            <div className="p-5 md:p-6">
              <h3 className="text-white text-xl font-medium tracking-tight">Meet your AI Travel Agent</h3>
              <p className="text-gray-400 text-sm mt-1">Understands context. Books in seconds. Keeps you on policy.</p>
            </div>
            <div className="relative aspect-[16/9]">
              <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372671794094522374%20%281%29-mXhXqJuzE8yRQG72P48PBvFH1FNb7X.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-5 md:p-6 flex items-center justify-between">
              <div className="text-xs text-gray-400">Real-time booking and assistance</div>
              <button
                className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 transition"
                onClick={() => showToast("Added to your dashboard")}
              >
                Try it
              </button>
            </div>

            {toast && (
              <div
                className={`absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-500 ${
                  toast.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
                }`}
              >
                <div className="text-white text-sm font-medium">{toast.message}</div>
              </div>
            )}
          </div>

          {/* Glass list card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl">
            <div className="p-5 md:p-6">
              <h3 className="text-white text-xl font-medium tracking-tight">Calm, focused interactions</h3>
              <p className="text-gray-400 text-sm mt-1">A clean design that gets out of the way. Nothing extra.</p>
            </div>
            <div className="px-5 md:px-6 pb-5">
              <ul className="space-y-2">
                {[
                  "Glass surfaces with subtle depth",
                  "Clear hierarchy of information",
                  "Soft motion and predictable feedback",
                  "Accessible by design",
                ].map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/40" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <button
                  onClick={() => showToast("Preferences saved")}
                  className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 transition"
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}