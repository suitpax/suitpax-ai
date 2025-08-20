"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
// Removed AirlinesSlider to avoid partners showcase with airline logos in this section
import { PlusCircle } from "lucide-react"
import { PiCheckCircle } from "react-icons/pi"

// Breakpoint personalizado para pantallas muy pequeñas
const useExtraSmallScreen = () => {
  const [isXs, setIsXs] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsXs(window.innerWidth < 480)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return isXs
}

// Mini Chat para Hyperspeed
const HyperspeedMiniChat = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-transparent backdrop-blur-sm shadow-sm w-auto max-w-[320px] mx-auto"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative w-8 h-8 overflow-hidden rounded-xl border border-gray-200">
        <Image
          src="/agents/agent-15.png"
          alt="Suitpax AI Agent"
          width={32}
          height={32}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-0.5 px-1.5 text-[10px] text-gray-700 h-8 flex items-center overflow-hidden">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          Book SFO→NYC next Tuesday, business class, under $1200
        </span>
      </div>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700 mr-1"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>

      {/* Pulse effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full bg-white/5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      )}
    </motion.div>
  )
}

export const HyperspeedBooking = () => {
  const isXs = useExtraSmallScreen()
  const [showFullFlow, setShowFullFlow] = useState(false)
  const [showExecutiveFlow, setShowExecutiveFlow] = useState(false)

  // Un solo ejemplo de chat
  const chatRequest =
    "I need to book a business trip from London to San Francisco next week with British Airways. Need business class, hotel near Financial District, and car rental. Must comply with our travel policy."
  const chatResponse =
    "Found 3 BA flights from LHR to SFO next week. Recommended: BA287 on Tuesday at 11:30 AM, business class ($2,450). Hilton Financial District available for 4 nights ($1,200). Hertz premium car included. Total package: $3,950. All options comply with your company's travel policy. Shall I proceed with booking?"

  // Efecto para añadir partículas dinámicas
  useEffect(() => {
    // Crear partículas dinámicas
    const createParticles = () => {
      const container = document.querySelector(".hyperspeed-container")
      if (!container) return

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div")
        particle.classList.add("particle")

        // Posición y tamaño aleatorios
        particle.style.top = `${Math.random() * 100}%`
        particle.style.width = `${50 + Math.random() * 150}px`
        particle.style.height = `${1 + Math.random() * 2}px`
        particle.style.opacity = `${0.1 + Math.random() * 0.3}`

        // Animación con retraso aleatorio
        particle.style.animationDelay = `${Math.random() * 8}s`
        particle.style.animationDuration = `${5 + Math.random() * 10}s`

        container.appendChild(particle)
      }
    }

    createParticles()

    // Limpiar partículas al desmontar
    return () => {
      const particles = document.querySelectorAll(".particle")
      particles.forEach((particle) => {
        particle.parentNode?.removeChild(particle)
      })
    }
  }, [])

  return (
    <section className="w-full bg-black py-20 relative overflow-hidden hyperspeed-container">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Elementos disruptivos */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Líneas de velocidad */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-sky-200/30 to-transparent"
              style={{
                top: `${Math.random() * 100}%`,
                left: 0,
                width: `${50 + Math.random() * 50}%`,
                opacity: 0.1 + Math.random() * 0.3,
                transform: `rotate(${Math.random() * 5}deg)`,
                animation: `flow-speed ${3 + Math.random() * 8}s linear infinite`,
              }}
            ></div>
          ))}
        </div>

        {/* Orbes tecnológicos */}
        <div className="absolute top-1/4 right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-sky-500/5 to-purple-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-white/5 to-sky-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header con título mejorado */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-3">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={16}
                height={16}
                className="mr-1.5 h-3.5 w-auto"
              />
              Hyperspeed Booking
            </div>

            {/* Título aumentado un nivel */}
            <h2 className="flex items-center justify-center text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-tight mb-4 py-2">
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Business travel at the speed of thought
              </span>
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto mb-2">
              Our AI-powered booking system processes complex travel requests in milliseconds, delivering optimal
              itineraries tailored to your business needs.
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs font-light max-w-xl mx-auto">
              Experience the future of business travel with intelligent recommendations, real-time updates, and seamless
              integrations with your existing workflow.
            </p>

            {/* Mini Chat para Hyperspeed */}
            <div className="mt-4 max-w-xs mx-auto">
              <HyperspeedMiniChat />
            </div>
          </div>

          {/* Flight Badges */}
          <div className="mb-12 max-w-lg mx-auto">
            <div className="rounded-xl border border-gray-500/20 p-2.5 bg-black/20 backdrop-blur-sm">
              <div className="flex flex-col space-y-1.5">
                {/* American Airlines Badge - Ejemplo Principal */}
                <div className="relative w-full">
                  <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                    <div className="flex flex-col items-center w-full">
                      <Image
                        src="https://cdn.brandfetch.io/aa.com/w/512/h/78/theme/light/logo?c=1idU-l8vdm7C5__3dci"
                        alt="American Airlines"
                        width={24}
                        height={10}
                        className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                      />
                      <div className="text-center w-full">
                        <div className="text-white text-[8px] font-medium">New York (JFK) → Los Angeles (LAX)</div>
                        <div className="text-gray-400 text-[6px]">AA123 • 6h 15m • Business Class</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-1.5">
                      <div className="text-gray-300 text-[7px] font-medium mr-0.5">Approved</div>
                      <div className="bg-gray-700/50 rounded-md p-0.5">
                        <PiCheckCircle className="text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                <div className="flex justify-center">
                  <div className="h-1.5 w-px bg-gray-500/30"></div>
                </div>

                {/* Try Business Travel Flow Badge */}
                <div className="relative w-full">
                  <button
                    onClick={() => setShowFullFlow(!showFullFlow)}
                    className="w-full text-left focus:outline-none"
                  >
                    <div className="relative flex items-center justify-between bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-sky-200/50 hover:border-white/70 transition-colors animate-border-flow overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-200/20 via-white/20 to-sky-200/20 animate-gradient-x opacity-30"></div>
                      <div className="flex items-center space-x-1 relative z-10">
                        <div className="h-3 w-3 flex items-center justify-center">
                          <PlusCircle className="h-3 w-3 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-white text-[8px] font-medium">Try Business Travel Flow</div>
                          <div className="text-gray-400 text-[6px]">See the complete booking experience</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-[7px] font-medium relative z-10">Click to expand</div>
                    </div>
                  </button>
                </div>

                {/* Full Flow (Conditional) */}
                {showFullFlow && (
                  <>
                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Tesla to Hilton Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/tesla.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Tesla"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">LAX Airport → Hilton Downtown LA</div>
                            <div className="text-gray-400 text-[6px]">Tesla Model S • 30min • Premium Service</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Approved</div>
                          <div className="bg-gray-700/50 rounded-md p-0.5">
                            <PiCheckCircle className="text-gray-400 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Anthropic Flight Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/anthropic.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Anthropic"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">San Francisco (SFO) → Tokyo (HND)</div>
                            <div className="text-gray-400 text-[6px]">JL001 • 11h 45m • First Class</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Approved</div>
                          <div className="bg-gray-700/50 rounded-md p-0.5">
                            <PiCheckCircle className="text-gray-400 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Hilton Hotel Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/hilton.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Hilton"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">Hilton Tokyo • Executive Suite</div>
                            <div className="text-gray-400 text-[6px]">
                              4 nights • Breakfast included • Business amenities
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Approved</div>
                          <div className="bg-gray-700/50 rounded-md p-0.5">
                            <PiCheckCircle className="text-gray-400 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Revolut Payment Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/revolut.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Revolut"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">Payment • Anthropic Corporate Card</div>
                            <div className="text-gray-400 text-[6px]">
                              $8,750 • Travel expenses • Automatically categorized
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Processed</div>
                          <div className="bg-gray-700/50 rounded-md p-0.5">
                            <PiCheckCircle className="text-gray-400 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Connector */}
                <div className="flex justify-center">
                  <div className="h-1.5 w-px bg-gray-500/30"></div>
                </div>

                {/* Try Executive Travel Flow Badge */}
                <div className="relative w-full">
                  <button
                    onClick={() => setShowExecutiveFlow(!showExecutiveFlow)}
                    className="w-full text-left focus:outline-none"
                  >
                    <div className="relative flex items-center justify-between bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-emerald-200/50 hover:border-white/70 transition-colors animate-border-flow overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/20 via-white/20 to-emerald-200/20 animate-gradient-x opacity-30"></div>
                      <div className="flex items-center space-x-1 relative z-10">
                        <div className="h-3 w-3 flex items-center justify-center">
                          <PlusCircle className="h-3 w-3 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-white text-[8px] font-medium">Try Startup Travel Flow</div>
                          <div className="text-gray-400 text-[6px]">See efficient startup travel experience</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-[7px] font-medium relative z-10">Click to expand</div>
                    </div>
                  </button>
                </div>

                {/* Executive Flow (Conditional) */}
                {showExecutiveFlow && (
                  <>
                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Emirates Flight Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/southwest.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Southwest"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">San Francisco (SFO) → Austin (AUS)</div>
                            <div className="text-gray-400 text-[6px]">WN1435 • 3h 45m • Business Select</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Approved</div>
                          <div className="bg-gray-700/50 rounded-md p-0.5">
                            <PiCheckCircle className="text-gray-400 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Rolls Royce Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/audi.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Audi"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">AUS Airport → Downtown Austin</div>
                            <div className="text-gray-400 text-[6px]">Audi Q5 • 20min • Business Package</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Approved</div>
                          <div className="bg-gray-700/50 rounded-md p-0.5">
                            <PiCheckCircle className="text-gray-400 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Burj Al Arab Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/marriott.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Marriott"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">
                              Austin Marriott Downtown • Business Suite
                            </div>
                            <div className="text-gray-400 text-[6px]">
                              3 nights • Coworking space • Startup-friendly rates
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Approved</div>
                          <div className="bg-gray-700/50 rounded-md p-0.5">
                            <PiCheckCircle className="text-gray-400 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats and Chat Section */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Stats */}
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-1 sm:mb-2"
              >
                <span className="text-5xl sm:text-7xl md:text-8xl font-medium bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                  95%
                </span>
              </motion.div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">
                Hyperspeed booking efficiency compared to traditional travel management platforms
              </p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  Instant booking
                </span>
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  AI optimization
                </span>
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  Real-time updates
                </span>
              </div>
            </div>

            {/* Chat Example simplificado sin bordes */}
            <div className="bg-transparent p-4 sm:p-5 border border-gray-800/30 rounded-xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md overflow-hidden">
                  <Image
                    src="/agents/agent-5.png"
                    alt="AI Travel Agent"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white text-xs font-medium">Maya</div>
                  <div className="text-gray-500 text-[10px]">AI Travel Agent</div>
                </div>
              </div>

              <div className="space-y-2">
                {/* Mensaje del usuario - más estructurado y atractivo */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-gray-200/20 p-3 text-[10px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                    <p className="text-gray-300 text-[8px] font-medium">User Request</p>
                  </div>
                  <div className="pl-3 space-y-1.5">
                    <p className="text-gray-300 font-medium">Business Trip Request:</p>
                    <p className="text-gray-400">London → San Francisco</p>
                    <p className="text-gray-400">British Airways • Business Class</p>
                    <p className="text-gray-400">Hotel near Financial District + Car rental</p>
                    <p className="text-gray-400 text-[8px] italic mt-1">Must comply with company travel policy</p>
                  </div>
                </div>

                {/* Respuesta del AI - más estructurada y atractiva */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-gray-200/20 p-3 text-[10px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <Image
                        src="/agents/agent-5.png"
                        alt="Maya AI Agent"
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-300 text-[8px] font-medium">Suitpax AI</p>
                      <p className="text-gray-500 text-[7px]">Maya • AI Agent</p>
                    </div>
                  </div>
                  <div className="pl-3 space-y-1.5">
                    <p className="text-gray-300 font-medium">Found 3 BA flights from LHR to SFO next week:</p>
                    <p className="text-gray-400">
                      Recommended: <span className="text-white">BA287</span> on Tuesday at 11:30 AM
                    </p>
                    <p className="text-gray-400">Business class ($2,450)</p>
                    <p className="text-gray-400">Hilton Financial District • 4 nights ($1,200)</p>
                    <p className="text-gray-400">Tesla premium car included</p>
                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-700/30">
                      <p className="text-gray-300 font-medium">
                        Total package: <span className="text-white">$3,950</span>
                      </p>
                      <p className="text-gray-300 text-[8px]">Policy compliant ✓</p>
                    </div>
                    <p className="text-gray-300 italic mt-1">Shall I proceed with booking?</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <div className="text-[10px] text-gray-400">Response time: 1.2s</div>
                <div className="text-emerald-400 text-[10px] font-medium">95% faster</div>
              </div>
            </div>
          </div>

          {/* Airlines slider removed from marketing section per request */}
        </div>
      </div>
    </section>
  )
}

export default HyperspeedBooking
