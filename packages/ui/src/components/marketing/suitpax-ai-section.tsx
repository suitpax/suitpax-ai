"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShiningText } from "../ui/shining-text"
import Link from "next/link"

// Mini Chat para IA
const AIMiniChat = ({
  prompt,
  response,
  agentImage,
  category,
}: {
  prompt: string
  response: string
  agentImage: string
  category: string
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative flex flex-col gap-3 p-4 rounded-xl border border-sky-200/20 bg-black/40 backdrop-blur-sm shadow-sm w-full max-w-md mx-auto overflow-hidden"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Efecto de glow azul claro */}
      <div className="absolute inset-0 bg-sky-500/5 blur-xl rounded-xl"></div>

      {/* Categoría */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 text-[10px] font-medium text-sky-300 border border-sky-500/20">
          {category}
        </span>
      </div>

      {/* Prompt del usuario */}
      <div className="relative z-10 flex items-start gap-2 bg-black/60 p-3 rounded-xl border border-gray-800">
        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-300">{prompt}</p>
        </div>
      </div>

      {/* Respuesta del AI */}
      <div className="relative z-10 flex items-start gap-2 bg-black/60 p-3 rounded-xl border border-sky-900/30">
        <div className="relative w-6 h-6 overflow-hidden rounded-full border border-sky-500/30">
          <Image
            src={agentImage || "/placeholder.svg"}
            alt="Suitpax AI Agent"
            width={24}
            height={24}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-300">{response}</p>
        </div>
      </div>

      {/* Pulse effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-sky-500/5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      )}
    </motion.div>
  )
}

// Componente de Feature Card
const AIFeatureCard = ({
  title,
  description,
  icon,
  glowColor = "sky",
}: {
  title: string
  description: string
  icon: React.ReactNode
  glowColor?: "sky" | "emerald" | "purple"
}) => {
  const glowClasses = {
    sky: "from-sky-500/10 to-sky-500/5",
    emerald: "from-emerald-500/10 to-emerald-500/5",
    purple: "from-purple-500/10 to-purple-500/5",
  }

  const borderClasses = {
    sky: "border-sky-500/20",
    emerald: "border-emerald-500/20",
    purple: "border-purple-500/20",
  }

  return (
    <div className="relative rounded-xl border bg-black/40 backdrop-blur-sm p-4 h-full">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glowClasses[glowColor]} blur-xl rounded-xl`}></div>

      {/* Content */}
      <div className="relative z-10">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-black/60 border ${borderClasses[glowColor]}`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-medium tracking-tighter text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}

export const SuitpaxAISection = () => {
  // Efecto para añadir partículas dinámicas
  useEffect(() => {
    // Crear partículas dinámicas
    const createParticles = () => {
      const container = document.querySelector(".suitpax-ai-container")
      if (!container) return

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div")
        particle.classList.add("ai-particle")

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
      const particles = document.querySelectorAll(".ai-particle")
      particles.forEach((particle) => {
        particle.parentNode?.removeChild(particle)
      })
    }
  }, [])

  // Ejemplos de chats para diferentes casos de uso
  const chatExamples = [
    {
      category: "Expense Management",
      prompt: "Analiza mis gastos de viaje del último trimestre y muestra las categorías principales",
      response:
        "He analizado tus gastos del último trimestre. Las categorías principales son: Vuelos (42%), Hoteles (28%), Comidas (15%), Transporte local (10%), y Otros (5%). Los gastos en vuelos han aumentado un 12% respecto al trimestre anterior.",
      agentImage: "/agents/agent-15.png",
    },
    {
      category: "Travel Management",
      prompt: "Necesito organizar un viaje para 5 ejecutivos a la conferencia de San Francisco en marzo",
      response:
        "He encontrado 3 opciones de vuelo directo para las fechas de la conferencia (15-18 marzo). Recomiendo el Hilton Union Square (a 5 min de la conferencia) con tarifas corporativas. ¿Quieres que reserve salas de reuniones adicionales?",
      agentImage: "/agents/agent-20.png",
    },
    {
      category: "Financial Reporting",
      prompt: "Genera un informe de ROI de nuestros viajes de negocios del 2023",
      response:
        "Informe generado. El ROI global de viajes de negocios fue 3.2x. Los viajes a conferencias tuvieron el mayor retorno (4.5x), seguidos por visitas a clientes (3.8x). Recomiendo aumentar el presupuesto para conferencias en un 15% para 2024.",
      agentImage: "/agents/agent-25.png",
    },
  ]

  // Estado para controlar qué chat se muestra
  const [activeChatIndex, setActiveChatIndex] = useState(0)

  return (
    <section className="w-full bg-black py-20 relative overflow-hidden suitpax-ai-container">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Elementos disruptivos */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orbes tecnológicos */}
        <div className="absolute top-1/4 right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-sky-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header con título mejorado */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-xl bg-sky-950/50 border border-sky-500/20 px-2.5 py-0.5 text-[10px] font-medium text-sky-300 mb-3">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={16}
                height={16}
                className="mr-1.5 h-3.5 w-auto"
              />
              SUITPAX AI SUITE
            </div>

            {/* Título con efecto brillante */}
            <ShiningText
              text="Inteligencia artificial para cada aspecto de tu negocio"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-tight mb-4 py-2 text-white"
            />

            <p className="mt-4 text-xs sm:text-sm font-medium text-gray-400 max-w-2xl mx-auto mb-2">
              Nuestras soluciones de IA transforman la gestión de viajes, gastos y finanzas con inteligencia predictiva
              y automatización avanzada.
            </p>
            <p className="text-gray-500 text-[10px] sm:text-xs font-light max-w-xl mx-auto text-white/70">
              Diseñado para equipos financieros, gestores de viajes y ejecutivos que buscan optimizar procesos y
              maximizar el ROI.
            </p>
          </div>

          {/* Sección de casos de uso con pestañas */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["Expense Management", "Travel Management", "Financial Teams"].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveChatIndex(index)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeChatIndex === index
                      ? "bg-sky-500/20 text-white border border-sky-500/30"
                      : "bg-black/40 text-gray-400 border border-gray-800 hover:border-sky-500/20 text-white/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Chat example */}
            <div className="max-w-md mx-auto">
              <AIMiniChat
                prompt={chatExamples[activeChatIndex].prompt}
                response={chatExamples[activeChatIndex].response}
                agentImage={chatExamples[activeChatIndex].agentImage}
                category={chatExamples[activeChatIndex].category}
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <AIFeatureCard
              title="Expense Management AI"
              description="Automatiza la categorización de gastos, detecta anomalías y genera informes detallados con un solo clic."
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sky-400"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              }
              glowColor="sky"
            />
            <AIFeatureCard
              title="Business Travel AI"
              description="Planifica viajes optimizados según preferencias, políticas de empresa y presupuestos con recomendaciones inteligentes."
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  <path d="M14.05 2a9 9 0 0 1 8 7.94" />
                  <path d="M14.05 6A5 5 0 0 1 18 10" />
                </svg>
              }
              glowColor="emerald"
            />
            <AIFeatureCard
              title="Financial Analytics"
              description="Analiza tendencias de gastos, predice costos futuros y optimiza presupuestos con modelos predictivos avanzados."
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-400"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              }
              glowColor="purple"
            />
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-2"
              >
                <span className="text-5xl sm:text-6xl font-medium bg-gradient-to-r from-sky-300 to-sky-500 text-transparent bg-clip-text">
                  85%
                </span>
              </motion.div>
              <p className="text-gray-400 text-sm font-medium">Reducción en tiempo de procesamiento de gastos</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-2"
              >
                <span className="text-5xl sm:text-6xl font-medium bg-gradient-to-r from-emerald-300 to-emerald-500 text-transparent bg-clip-text">
                  32%
                </span>
              </motion.div>
              <p className="text-gray-400 text-sm font-medium">Ahorro promedio en costos de viajes de negocios</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-2"
              >
                <span className="text-5xl sm:text-6xl font-medium bg-gradient-to-r from-purple-300 to-purple-500 text-transparent bg-clip-text">
                  3.8x
                </span>
              </motion.div>
              <p className="text-gray-400 text-sm font-medium">ROI promedio para empresas que utilizan Suitpax AI</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="inline-block p-[1px] rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500">
              <Link
                href="https://app.suitpax.com/sign-up"
                className="block px-8 py-3 rounded-xl bg-black text-white font-medium hover:bg-black/80 transition-colors"
              >
                Descubre Suitpax AI
              </Link>
            </div>
            <p className="text-gray-500 text-xs mt-4 text-white/70">
              Prueba gratuita por 14 días. No se requiere tarjeta de crédito.
            </p>
          </div>
        </div>
      </div>

      {/* CSS para las partículas */}
      <style jsx global>{`
        .ai-particle {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.2), transparent);
          transform: translateX(-50%);
          animation: flow-speed linear infinite;
        }
        @keyframes flow-speed {
          0% {
            transform: translateX(-100%) rotate(5deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(200%) rotate(5deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

export default SuitpaxAISection
