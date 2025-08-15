"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Ejemplos de prompts mejorados enfocados en business travel
const placeholderExamples = [
  // Viajes de negocios
  "Find me a business class flight to Tokyo for next Tuesday...",
  "Book a hotel near the financial district in Singapore for 3 nights...",
  "Schedule a team business trip to New York for our quarterly meeting...",
  "Find the best corporate rates for hotels in London next month...",
  "Book a conference room at the Marriott in Chicago for tomorrow...",
  "Arrange airport pickup for our executive team arriving in Dubai...",
  "Find direct flights from San Francisco to Berlin for our team...",

  // Políticas de viaje automatizadas
  "Update our company travel policy to include new expense limits...",
  "Check if this business class booking complies with our travel policy...",
  "Generate a travel policy report for Q2 expenses...",
  "Notify team members about updated travel policy guidelines...",
  "Set up automated approval for trips under $2,000...",

  // Gestin de tareas
  "Schedule a meeting with the London team at their office next week...",
  "Create a task list for my business trip to Paris...",
  "Remind me to prepare my presentation before the Tokyo meeting...",
  "Organize my calendar for the upcoming conference in Barcelona...",
  "Set priority for travel arrangements for the executive retreat...",

  // Reserva y búsqueda
  "Find me a direct flight to Frankfurt with lounge access...",
  "Book a 5-star hotel in Manhattan with a business center...",
  "Compare business class prices to Seoul for next quarter...",
  "Find available meeting rooms near our client's office in Toronto...",
  "Book a restaurant for client dinner in Madrid with private dining...",

  // Gestión de gastos
  "Prepare an expense report for my Asia business trip...",
  "Track expenses for our team's conference attendance...",
  "Categorize my recent business expenses for tax purposes...",
  "Submit my hotel receipts to the expense management system...",
  "Calculate per diem for my week-long trip to Germany...",

  // Servicios VIP
  "Arrange VIP airport service for our CEO in Hong Kong...",
  "Book a luxury car service for client transportation in Milan...",
  "Reserve a private jet for our executive team next Thursday...",
  "Upgrade our VP's hotel reservation to a suite in Dubai...",
  "Arrange a private dining experience for our investors meeting...",

  // Información y asistencia
  "What's the weather forecast for my trip to Singapore next week?",
  "What's the exchange rate between USD and Euro today?",
  "Do I need a visa for my business trip to India?",
  "What are the COVID restrictions for business travel to Japan?",
  "How much time should I allow for transit at Heathrow Airport?",

  // Cambios y flexibilidad
  "Reschedule my flight due to the conference date change...",
  "Find me a workspace in downtown Chicago for tomorrow's meetings...",
  "Change my hotel reservation to include an extra night in Berlin...",
  "Cancel my business trip to Sydney and recover refundable expenses...",
  "Extend my car rental for two more days in Los Angeles...",
]

// Demo mini-badge content
const demoBadges = [
  "Automated travel policies",
  "Premium business experience",
  "Control travel expenses",
  "Manage business trips",
  "Schedule team calls",
  "Book VIP airport service",
  "Find direct flights",
  "Optimize travel budget",
  "Track team locations",
  "Arrange client meetings",
  "Expense reporting",
  "Travel policy compliance",
  "Flight status alerts",
  "Hotel recommendations",
]

// Restaurar las imágenes de agentes en lugar de imágenes reales de usuarios
// Reemplazar las imágenes de userImages con las imágenes de agentes
const userImages = [
  "/agents/agent-1.png",
  "/agents/agent-2.png",
  "/agents/agent-3.png",
  "/agents/agent-4.png",
  "/agents/agent-5.png",
  "/agents/agent-6.png",
  "/agents/agent-7.png",
  "/agents/agent-8.png",
]

const AIChat = () => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [visibleBadges, setVisibleBadges] = useState<number[]>([])
  const [currentUser, setCurrentUser] = useState(0)

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

      // Change user when moving to a new placeholder
      setCurrentUser((currentUser + 1) % userImages.length)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentPlaceholder, isTypingComplete, currentUser])

  // Handle badge animation
  useEffect(() => {
    // No animations or rotations needed anymore
  }, [])

  return (
    <div className="w-full">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {/* Simple mini badges without animations */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 relative">
          <div className="mb-4 w-full">
            <p className="text-sm font-medium mb-3 text-left">Why Suitpax?</p>
            <ol className="text-xs text-left space-y-2 mx-auto">
              <li className="mb-1">1. The next-gen traveltech revolutionizing business travel</li>
              <li className="mb-1">2. AI-powered agents with MCP superpowers that understand your unique needs</li>
              <li className="mb-1">3. Seamless integration with your existing workflow</li>
              <li className="mb-1">4. Hyperspeed capabilities for the modern business traveler</li>
              <li className="mb-1">5. Automated travel policies that ensure compliance and cost control</li>
            </ol>
          </div>
          <p className="text-xs font-medium mb-2 text-left w-full">Main features of our product:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {demoBadges.slice(0, 8).map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center rounded-xl border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Añadir también texto descriptivo para lectores de pantalla */}
        <span className="sr-only">
          This is a demonstration of the AI chat interface. The typing animation shows example prompts.
        </span>

        {/* Non-interactive chat input (visual demo only) */}
        <div
          className="relative flex items-center gap-2 p-1 rounded-xl border border-gray-400 shadow-sm"
          role="textbox"
          aria-label="AI Chat input"
          aria-readonly="true"
        >
          {/* User image - now changes dynamically */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUser}
              className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-300 ml-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={userImages[currentUser] || "/placeholder.svg"}
                alt="User"
                width={40}
                height={40}
                className="w-full h-full object-cover object-center"
              />
              {/* Removed the green dot indicator that was here */}
            </motion.div>
          </AnimatePresence>

          {/* Placeholder with typing animation */}
          <div className="flex-1 py-2 px-2 text-xs text-gray-500 h-10 flex items-center">
            <span className="inline-block text-xs">
              {typedText}
              {!isDeleting && !isTypingComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
                  className="inline-block w-0.5 h-3 bg-gray-400 ml-0.5"
                />
              )}
            </span>
          </div>

          {/* Send button (visual only) */}
          <div className="text-gray-400 mr-2">
            <svg
              width="18"
              height="18"
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

        {/* "Powered by" text */}
        <div className="mt-2 text-center">
          <span className="text-[10px] text-gray-400">Powered by Suitpax Engineering</span>
        </div>
      </motion.div>
    </div>
  )
}

export default AIChat
