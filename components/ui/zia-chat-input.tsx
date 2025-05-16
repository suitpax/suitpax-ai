"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ShiningText } from "./shining-text"

// Ejemplos de prompts para el placeholder
const placeholderExamples = [
  "Find me the best flight to New York...",
  "What's the weather like in Tokyo?",
  "Book a meeting room for tomorrow...",
  "Reschedule my flight to next week...",
  "Find a hotel near my conference...",
  "What's my travel budget status?",
]

export function ZiaChatInput() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  // Agente AI rubio de pelo blanco - usando agent-15 que tiene ese aspecto
  const agentImage = "/agents/agent-15.png"

  // Handle typing animation
  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Typing effect
    if (!isDeleting && typedText.length < placeholderExamples[currentPlaceholder].length) {
      timeout = setTimeout(
        () => {
          setTypedText(placeholderExamples[currentPlaceholder].substring(0, typedText.length + 1))
        },
        50 + Math.random() * 50,
      ) // Random typing speed for natural effect
    }
    // Pause when typing is complete
    else if (!isDeleting && typedText === placeholderExamples[currentPlaceholder]) {
      setIsTypingComplete(true)
      timeout = setTimeout(() => {
        setIsDeleting(true)
        setIsTypingComplete(false)
      }, 2000) // Wait before deleting
    }
    // Deleting effect
    else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => {
        setTypedText(placeholderExamples[currentPlaceholder].substring(0, typedText.length - 1))
      }, 30) // Faster deletion
    }
    // Move to next example
    else if (isDeleting && typedText === "") {
      setIsDeleting(false)
      setCurrentPlaceholder((currentPlaceholder + 1) % placeholderExamples.length)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentPlaceholder, isTypingComplete])

  // Simular el estado "thinking" cada cierto tiempo
  useEffect(() => {
    const thinkingInterval = setInterval(() => {
      setIsThinking(true)
      setTimeout(() => setIsThinking(false), 3000)
    }, 10000)

    return () => clearInterval(thinkingInterval)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card con estilo similar al VantaCloudsBackground */}
        <div className="relative w-full h-auto min-h-[380px] overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
          {/* Fondo gris claro */}
          <div className="absolute inset-0 w-full h-full bg-gray-50"></div>

          {/* Contenido superpuesto */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full p-6">
            {/* Título y subtítulos */}
            <div className="w-full text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                  <Image
                    src="/logo/suitpax-cloud-logo.webp"
                    alt="Suitpax"
                    width={50}
                    height={12}
                    className="h-3 w-auto mr-1"
                  />
                  <em className="font-serif italic">Assistant</em>
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-black">Meet Zia</h3>
              <p className="text-base font-light text-gray-700 mt-2">Your personal travel assistant</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Powered by advanced AI technology</p>
            </div>

            {/* Agente AI y estado "thinking" */}
            <div className="relative flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-gray-200 shadow-md mb-3">
                <Image
                  src={agentImage || "/placeholder.svg"}
                  alt="Zia AI Agent"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ShiningText text="Zia is thinking..." className="text-sm" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat input */}
            <div className="w-full">
              <div
                className="relative flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white shadow-sm w-full hover:border-gray-300 transition-all duration-300"
                role="textbox"
                aria-label="AI Chat input"
                aria-readonly="true"
              >
                {/* Placeholder with typing animation */}
                <div className="flex-1 py-2 px-3 text-sm text-gray-700 h-10 flex items-center">
                  <span className="inline-block">
                    {typedText}
                    {!isDeleting && !isTypingComplete && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
                        className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5"
                      />
                    )}
                  </span>
                </div>

                {/* Send button */}
                <div className="text-gray-600 mr-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
