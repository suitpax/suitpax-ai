"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Nuevos ejemplos de prompts enfocados en viajes de negocios - más cortos y más cantidad
const placeholderExamples = [
  "Book a flight to San Francisco...",
  "Find hotels near my meeting...",
  "Expense report for my last trip...",
  "Change my return flight...",
  "Best airport lounges in JFK?",
  "Car rental options in Chicago...",
  "Travel policy for executives?",
  "Optimize my travel budget...",
  "Schedule a team trip to Boston...",
  "Compare business class options...",
  "Visa requirements for Japan...",
  "Add my frequent flyer number...",
  "Best time to visit Singapore?",
  "Cancel my hotel reservation...",
  "Find direct flights only...",
]

// Imágenes de agentes para el avatar
const agentImages = [
  "/agents/agent-10.png",
  "/agents/agent-15.png",
  "/agents/agent-20.png",
  "/agents/agent-25.png",
  "/agents/agent-30.png",
  "/agents/agent-35.png",
]

const TravelChatInput = () => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [currentAgent, setCurrentAgent] = useState(0)

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
      setCurrentAgent((currentAgent + 1) % agentImages.length)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentPlaceholder, isTypingComplete, currentAgent])

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card con estilo similar al business travel slider */}
        <div className="relative w-full h-auto min-h-[380px] overflow-hidden rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-sm">
          {/* Imagen de fondo de San Francisco */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/san-francisco-skyline.jpg"
              alt="San Francisco Skyline"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-black/5"></div>
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="inline-block bg-black/40 backdrop-blur-sm text-[10px] text-white px-2 py-1 rounded-md font-mono">
                PRODUCT DEMO • INTERACTIVE PREVIEW
              </span>
            </div>
          </div>

          {/* Contenido superpuesto */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
            {/* Título y badge - cambiar de mb-auto a mb-0 */}
            <div className="w-full text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-xl bg-black/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white">
                  <Image
                    src="/logo/suitpax-cloud-logo.webp"
                    alt="Suitpax"
                    width={50}
                    height={12}
                    className="h-3 w-auto mr-1"
                  />
                  <em className="font-serif italic">Intelligence</em>
                </span>
              </div>
              <h3 className="text-xl font-medium tracking-tighter text-white">
                Business Travel AI, like an open-world
              </h3>
              <p className="text-xs text-gray-200 mt-1">Ask anything about business travel management</p>
            </div>

            {/* Chat input (visual demo only) - centrado verticalmente */}
            <div className="w-full flex justify-center items-center">
              <div
                className="relative flex items-center gap-2 p-3 rounded-xl border border-gray-400/30 bg-black/40 backdrop-blur-md shadow-sm w-full max-w-sm hover:bg-black/50 transition-all duration-300 transform hover:scale-[1.02]"
                role="textbox"
                aria-label="AI Chat input"
                aria-readonly="true"
              >
                {/* Agent avatar - changes dynamically */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAgent}
                    className="relative w-10 h-10 overflow-hidden rounded-xl border border-gray-500/50 ml-2 shadow-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={agentImages[currentAgent] || "/placeholder.svg"}
                      alt="Travel Agent"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Placeholder with typing animation */}
                <div className="flex-1 py-2 px-3 text-xs text-gray-200 h-10 flex items-center">
                  <span className="inline-block text-xs">
                    {typedText}
                    {!isDeleting && !isTypingComplete && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
                        className="inline-block w-0.5 h-3 bg-gray-300 ml-0.5"
                      />
                    )}
                  </span>
                </div>

                {/* Send button (visual only) */}
                <div className="text-gray-300 mr-2 bg-gray-800/30 p-1.5 rounded-full hover:bg-gray-800/50 cursor-pointer transition-colors">
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

            {/* Añadir un div vacío para equilibrar el espacio y centrar el chat */}
            <div className="mt-8"></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TravelChatInput
