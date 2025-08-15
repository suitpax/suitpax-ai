"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SiSlack } from "react-icons/si"

// Componente de contador
const LaunchCountdown = () => {
  // Fecha de lanzamiento (72 días desde el 28 de abril de 2025)
  const launchDate = new Date("2025-07-09T00:00:00")
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = launchDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <div className="flex flex-col items-center">
        <div className="text-2xl md:text-2xl font-medium text-white">{timeLeft.days}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider font-light">Days</div>
      </div>
      <div className="text-xl text-gray-500">:</div>
      <div className="flex flex-col items-center">
        <div className="text-2xl md:text-2xl font-medium text-white">{timeLeft.hours}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider font-light">Hours</div>
      </div>
      <div className="text-xl text-gray-500">:</div>
      <div className="flex flex-col items-center">
        <div className="text-2xl md:text-2xl font-medium text-white">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider font-light">Minutes</div>
      </div>
      <div className="text-xl text-gray-500">:</div>
      <div className="flex flex-col items-center">
        <div className="text-2xl md:text-2xl font-medium text-white">{timeLeft.seconds}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider font-light">Seconds</div>
      </div>
    </div>
  )
}

// Mini Chat para Launch Hero (estilo Hyperspeed)
const LaunchMiniChat = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [agentId, setAgentId] = useState(15)

  useEffect(() => {
    // Seleccionar un agente aleatorio entre varios IDs
    const agentIds = [10, 15, 22, 33, 40, 42]
    const randomIndex = Math.floor(Math.random() * agentIds.length)
    setAgentId(agentIds[randomIndex])
  }, [])

  return (
    <motion.div
      className="relative flex items-center gap-3 p-2 px-4 rounded-xl border border-gray-700/50 bg-black/80 backdrop-blur-md shadow-lg w-auto max-w-[420px] mx-auto"
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative w-8 h-8 overflow-hidden rounded-xl border border-gray-600/50">
        <Image
          src={`/agents/agent-${agentId}.png`}
          alt="Suitpax AI Agent"
          width={32}
          height={32}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-0.5 px-1.5 text-xs text-gray-200 h-8 flex items-center overflow-hidden">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          Welcome to the open-world of business travel
        </span>
      </div>
      <motion.div
        animate={isHovered ? { x: [0, 3, 0] } : {}}
        transition={{ repeat: isHovered ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-200 mr-1"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </motion.div>

      {/* Pulse effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-emerald-500/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      )}
    </motion.div>
  )
}

export const LaunchHero = () => {
  return (
    <section className="w-full bg-black py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Elementos disruptivos */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orbes tecnológicos */}
        <div className="absolute top-1/4 right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-sky-500/5 to-purple-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/5 to-sky-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header con título mejorado */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-xl bg-black/80 border border-gray-800 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-gray-300 mb-3">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={16}
                height={16}
                className="mr-1.5 h-3.5 w-auto"
              />
              Launching Soon
            </div>

            {/* Título impactante */}
            <h2 className="text-2xl font-medium tracking-tighter leading-tight mb-4 py-2">
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                The next-gen of business travel
              </span>
            </h2>

            <p className="text-gray-400 text-sm sm:text-base font-medium max-w-2xl mx-auto mb-2">
              Support our project with technical collaboration and feedback. Join us in creating the most intelligent,
              seamless travel experience ever designed.
            </p>

            <p className="text-gray-500 text-xs sm:text-sm font-light max-w-xl mx-auto">
              Join the waitlist today and be among the first pioneers to experience the future of business travel
              management.
            </p>

            {/* Contador de lanzamiento */}
            <LaunchCountdown />

            {/* Mini Chat para Launch */}
            <div className="mt-8 max-w-xs mx-auto">
              <LaunchMiniChat />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center mt-10">
              <a
                href="https://join.slack.com/t/suitpax/shared_invite/zt-2f0iqxw3h-KjHPE9hTkakzG9XJfpZmXQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl bg-black/80 border border-gray-700 backdrop-blur-md px-4 py-2 text-xs font-medium text-gray-300 hover:bg-black/60 transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(229,231,235,0.15)] hover:shadow-[0_0_20px_rgba(229,231,235,0.25)]"
              >
                <Image
                  src="/logo/suitpax-cloud-logo.webp"
                  alt="Suitpax"
                  width={20}
                  height={20}
                  className="mr-2 h-4 w-auto"
                />
                <SiSlack className="mr-2 h-4 w-4 text-gray-300" />
                Collaborate with us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LaunchHero
