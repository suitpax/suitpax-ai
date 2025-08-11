"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  SiZoom,
  SiSlack,
  SiGmail,
  SiGooglecalendar,
  SiGoogledrive,
  SiNotion,
  SiAsana,
  SiTrello,
  SiHubspot,
} from "react-icons/si"
import { Calendar, Mail, Clock, Users, Video, CheckCircle } from "lucide-react"

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

// Mini Chat para Meetings
const MeetingsMiniChat = () => {
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
          src="/agents/agent-5.png"
          alt="Suitpax AI Agent"
          width={32}
          height={32}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-0.5 px-1.5 text-[10px] text-gray-700 h-8 flex items-center overflow-hidden">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          Schedule a meeting with the marketing team for next Tuesday at 2 PM
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

// Componente de integración
const IntegrationIcon = ({ icon: Icon, name }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-200 p-3 rounded-xl mb-2 transition-all hover:bg-gray-300 hover:scale-105">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <span className="text-[10px] text-gray-500">{name}</span>
    </div>
  )
}

export const AIMeetingsAttachment = () => {
  const isXs = useExtraSmallScreen()

  // Efecto para añadir partículas dinámicas
  useEffect(() => {
    // Crear partículas dinámicas
    const createParticles = () => {
      const container = document.querySelector(".meetings-container")
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
    <section className="w-full bg-black py-20 relative overflow-hidden meetings-container">
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
              Smart Meeting Management
            </div>

            {/* Título aumentado un nivel */}
            <h2 className="flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-tight mb-4 py-2">
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Seamless meeting coordination
              </span>
            </h2>

            <p className="mt-4 text-xs sm:text-sm font-medium text-gray-400 max-w-2xl mx-auto mb-2">
              Our AI-powered meeting assistant integrates with your favorite tools to streamline scheduling,
              note-taking, and follow-up actions.
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs font-light max-w-xl mx-auto">
              Eliminate the back-and-forth of scheduling and automate meeting workflows with intelligent calendar
              management and email integration.
            </p>

            {/* Mini Chat para Meetings */}
            <div className="mt-4 max-w-xs mx-auto">
              <MeetingsMiniChat />
            </div>
          </div>

          {/* Calendar Showcase */}
          <div className="mb-12 max-w-lg mx-auto">
            <div className="rounded-xl border border-gray-500/20 p-2.5 bg-black/20 backdrop-blur-sm">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-200/10">
                <Image
                  src="https://tailark.com/_next/image?url=%2Forigin-cal-dark.png&w=3840&q=75"
                  alt="Calendar Integration"
                  width={1207}
                  height={929}
                  className="w-full h-full object-cover"
                />

                {/* Overlay elements */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200/20">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-300" />
                    <span className="text-[10px] text-gray-300">Smart scheduling</span>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] text-gray-300">AI-optimized time slots</span>
                  </div>
                </div>
              </div>

              {/* Feature badges */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">Calendar Sync</div>
                      <div className="text-[8px] text-gray-400">Automatic availability detection</div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">Email Integration</div>
                      <div className="text-[8px] text-gray-400">Automated invites & reminders</div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">Team Coordination</div>
                      <div className="text-[8px] text-gray-400">Find optimal meeting times</div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">Video Conferencing</div>
                      <div className="text-[8px] text-gray-400">One-click meeting links</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Grid */}
          <div className="mb-8">
            <h3 className="text-center text-xl text-white font-medium tracking-tighter mb-6">Seamless Integrations</h3>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <IntegrationIcon icon={SiGooglecalendar} name="Google Calendar" />
              <IntegrationIcon icon={SiZoom} name="Zoom" />
              <IntegrationIcon icon={SiSlack} name="Slack" />
              <IntegrationIcon icon={SiGmail} name="Gmail" />
              <IntegrationIcon icon={SiHubspot} name="Hubspot" />
              <IntegrationIcon icon={SiGoogledrive} name="Google Drive" />
              <IntegrationIcon icon={SiNotion} name="Notion" />
              <IntegrationIcon icon={SiAsana} name="Asana" />
              <IntegrationIcon icon={SiTrello} name="Trello" />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10 text-center">
              <div className="text-4xl font-medium text-white mb-2">85%</div>
              <div className="text-sm text-gray-400">Reduction in scheduling time</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10 text-center">
              <div className="text-4xl font-medium text-white mb-2">100%</div>
              <div className="text-sm text-gray-400">Automated meeting reminders</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10 text-center">
              <div className="text-4xl font-medium text-white mb-2">24/7</div>
              <div className="text-sm text-gray-400">AI scheduling assistant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIMeetingsAttachment