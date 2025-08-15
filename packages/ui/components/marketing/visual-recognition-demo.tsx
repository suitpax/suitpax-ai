"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { PiCheckCircle, PiPlusCircle } from "react-icons/pi"

// Mini Chat para OCR Vision
const OCRMiniChat = () => {
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
          src="/agents/agent-13.png"
          alt="Suitpax AI Agent"
          width={32}
          height={32}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-0.5 px-1.5 text-[10px] text-gray-700 h-8 flex items-center overflow-hidden">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          Scan this pitch deck and extract key metrics
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

export default function VisualRecognitionDemo() {
  const [showFullFlow, setShowFullFlow] = useState(false)
  const [showTechFlow, setShowTechFlow] = useState(false)

  // Efecto para añadir partículas dinámicas
  useEffect(() => {
    // Crear partículas dinámicas
    const createParticles = () => {
      const container = document.querySelector(".vision-container")
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
    <section className="w-full bg-black py-20 relative overflow-hidden vision-container">
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
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/5 to-sky-500/5 blur-3xl"></div>
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
              Visual Recognition
            </div>

            {/* Título aumentado un nivel */}
            <h2 className="flex items-center justify-center text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-tight mb-4 py-2">
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Document scanning at the speed of innovation
              </span>
            </h2>

            <p className="text-gray-400 text-xs sm:text-sm font-medium max-w-2xl mx-auto mb-2">
              Our AI-powered visual recognition system processes any business document in milliseconds, extracting key
              data automatically.
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs font-light max-w-xl mx-auto">
              <span className="font-serif italic">Techne intelligentia</span> — Experience the future of document
              processing with intelligent recognition, data extraction, and seamless integration with your startup
              workflow.
            </p>

            {/* Mini Chat para OCR Vision */}
            <div className="mt-4 max-w-xs mx-auto">
              <OCRMiniChat />
            </div>
          </div>

          {/* Document Badges */}
          <div className="mb-12 max-w-lg mx-auto">
            <div className="rounded-xl border border-gray-500/20 p-2.5 bg-black/20 backdrop-blur-sm">
              <div className="flex flex-col space-y-1.5">
                {/* Boarding Pass Badge - Ejemplo Principal */}
                <div className="relative w-full">
                  <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                    <div className="flex flex-col items-center w-full">
                      <Image
                        src="https://cdn.brandfetch.io/british-airways.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                        alt="British Airways"
                        width={24}
                        height={10}
                        className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                      />
                      <div className="text-center w-full">
                        <div className="text-white text-[8px] font-medium">
                          Boarding Pass: San Francisco (SFO) → Austin (AUS)
                        </div>
                        <div className="text-gray-400 text-[6px]">
                          BA2490 • June 12, 2025 • Seat 4A • Business Class
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

                {/* Connector */}
                <div className="flex justify-center">
                  <div className="h-1.5 w-px bg-gray-500/30"></div>
                </div>

                {/* Try Document Flow Badge */}
                <div className="relative w-full">
                  <button
                    onClick={() => setShowFullFlow(!showFullFlow)}
                    className="w-full text-left focus:outline-none"
                  >
                    <div className="relative flex items-center justify-between bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-sky-200/50 hover:border-white/70 transition-colors animate-border-flow overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-200/20 via-white/20 to-sky-200/20 animate-gradient-x opacity-30"></div>
                      <div className="flex items-center space-x-1 relative z-10">
                        <div className="h-3 w-3 flex items-center justify-center">
                          <PiPlusCircle className="h-3 w-3 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-white text-[8px] font-medium">Try Business Travel Flow</div>
                          <div className="text-gray-400 text-[6px]">
                            See the complete business travel document processing
                          </div>
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

                    {/* Hotel Receipt Badge */}
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
                              Hotel Receipt: Austin Marriott Downtown
                            </div>
                            <div className="text-gray-400 text-[6px]">
                              June 12-15, 2025 • $750.00 • Business Suite • Conf #MA87654
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Added to expenses</div>
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

                    {/* Car Rental Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <Image
                            src="https://cdn.brandfetch.io/hertz.com/w/512/h/512/logo?c=1idU-l8vdm7C5__3dci"
                            alt="Hertz"
                            width={24}
                            height={10}
                            className="h-2.5 w-auto object-contain invert brightness-0 filter mb-1"
                          />
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">Car Rental Voucher: Austin Airport</div>
                            <div className="text-gray-400 text-[6px]">
                              June 12-15, 2025 • Tesla Model 3 • Reservation #HZ82945
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

                {/* Try Tech Document Flow Badge */}
                <div className="relative w-full">
                  <button
                    onClick={() => setShowTechFlow(!showTechFlow)}
                    className="w-full text-left focus:outline-none"
                  >
                    <div className="relative flex items-center justify-between bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-emerald-200/50 hover:border-white/70 transition-colors animate-border-flow overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/20 via-white/20 to-emerald-200/20 animate-gradient-x opacity-30"></div>
                      <div className="flex items-center space-x-1 relative z-10">
                        <div className="h-3 w-3 flex items-center justify-center">
                          <PiPlusCircle className="h-3 w-3 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-white text-[8px] font-medium">Try Startup Document Flow</div>
                          <div className="text-gray-400 text-[6px]">See the startup document processing experience</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-[7px] font-medium relative z-10">Click to expand</div>
                    </div>
                  </button>
                </div>

                {/* Tech Flow (Conditional) */}
                {showTechFlow && (
                  <>
                    {/* Connector */}
                    <div className="flex justify-center">
                      <div className="h-1.5 w-px bg-gray-500/30"></div>
                    </div>

                    {/* Pitch Deck Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <span className="font-serif italic text-white text-[10px] mb-1">Pitch Deck</span>
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">SaaS Metrics Extraction</div>
                            <div className="text-gray-400 text-[6px]">ARR: $2.4M • CAC: $850 • LTV: $12,500</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Data extracted</div>
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

                    {/* Business Card Badge */}
                    <div className="relative w-full">
                      <div className="relative flex flex-col items-center bg-transparent backdrop-blur-xl p-1.5 rounded-lg border border-black/80">
                        <div className="flex flex-col items-center w-full">
                          <span className="font-serif italic text-white text-[10px] mb-1">Business Card</span>
                          <div className="text-center w-full">
                            <div className="text-white text-[8px] font-medium">Contact Information</div>
                            <div className="text-gray-400 text-[6px]">
                              Sarah Chen • CTO at TechVenture • sarah@techventure.ai
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mt-1.5">
                          <div className="text-gray-300 text-[7px] font-medium mr-0.5">Added to contacts</div>
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
                <span className="text-5xl sm:text-7xl md:text-8xl font-inter font-medium bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                  0.8<span className="text-4xl sm:text-5xl">s</span>
                </span>
              </motion.div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">
                <span className="font-medium">Speed of innovation</span> — Average document processing time compared to
                15+ seconds with traditional OCR
              </p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  Instant recognition
                </span>
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  Data extraction
                </span>
                <span className="inline-flex items-center rounded-full bg-black/60 border border-white/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-300">
                  API integration
                </span>
              </div>
            </div>

            {/* Chat Example simplificado sin bordes */}
            <div className="bg-transparent p-4 sm:p-5 border border-gray-800/30 rounded-xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md overflow-hidden">
                  <Image
                    src="/agents/agent-13.png"
                    alt="AI Vision Agent"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white text-xs font-medium">Iris</div>
                  <div className="text-gray-500 text-[10px]">AI Vision Agent</div>
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
                    <p className="text-gray-300 font-medium">Document Scan Request:</p>
                    <p className="text-gray-400">Scan this pitch deck PDF</p>
                    <p className="text-gray-400">Extract key metrics and financials</p>
                    <p className="text-gray-400 text-[8px] italic mt-1 font-serif">
                      "TechVenture_Series-A_Deck_2025.pdf"
                    </p>
                  </div>
                </div>

                {/* Respuesta del AI - más estructurada y atractiva */}
                <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-gray-200/20 p-3 text-[10px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <Image
                        src="/agents/agent-13.png"
                        alt="Iris AI Agent"
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-300 text-[8px] font-medium">Suitpax AI</p>
                      <p className="text-gray-500 text-[7px]">
                        Iris • <span className="font-serif italic">Techne intelligentia</span>
                      </p>
                    </div>
                  </div>
                  <div className="pl-3 space-y-1.5">
                    <p className="text-gray-300 font-medium">Pitch Deck Analysis Complete:</p>
                    <p className="text-gray-400">
                      <span className="text-white">ARR:</span> $2.4M (87% YoY growth)
                    </p>
                    <p className="text-gray-400">
                      <span className="text-white">CAC:</span> $850 (improved 12% from last quarter)
                    </p>
                    <p className="text-gray-400">
                      <span className="text-white">LTV:</span> $12,500 (14.7x LTV:CAC ratio)
                    </p>
                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-700/30">
                      <p className="text-gray-300 font-medium">
                        <span className="text-white">15 metrics</span> extracted
                      </p>
                      <p className="text-emerald-400 text-[8px]">Saved to CRM ✓</p>
                    </div>
                    <p className="text-gray-300 italic mt-1 font-serif">Would you like me to prepare a summary?</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <div className="text-[10px] text-gray-400">Response time: 0.8s</div>
                <div className="text-emerald-400 text-[10px] font-medium">95% faster</div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-10 sm:mt-12">
            <p className="text-center text-gray-400 text-[10px] sm:text-xs mb-4 sm:mb-6 font-serif italic">
              "Data is the new oil, but only when refined" —{" "}
              <span className="font-medium not-italic">Suitpax Vision</span>
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { title: "Business Documents", desc: "Boarding passes, receipts, contracts" },
                { title: "Startup Metrics", desc: "Extract KPIs from pitch decks" },
                { title: "CRM Integration", desc: "Automatic contact import" },
                { title: "Offline Processing", desc: "Works without internet" },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-gray-700/30"
                >
                  <h4 className="text-white text-xs font-medium mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-[10px]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS para las partículas */}
      <style jsx global>{`
        .particle {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          height: 1px;
          animation: flow-left 8s linear infinite;
        }
        
        @keyframes flow-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes flow-speed {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-border-flow {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
