"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { PiRocketLaunchBold, PiChartLineUpBold, PiUsersBold, PiGlobeBold, PiDotsThreeBold } from "react-icons/pi"

// Datos actualizados para la comunidad - asegurando que todos los agentes estén incluidos
const communityMembers = [
  { id: 1, image: "/agents/agent-1.png" },
  { id: 2, image: "/agents/agent-2.png" },
  { id: 3, image: "/agents/agent-3.png" },
  { id: 4, image: "/agents/agent-4.png" },
  { id: 5, image: "/agents/agent-5.png" },
  { id: 6, image: "/agents/agent-6.png" },
  { id: 7, image: "/agents/agent-7.png" },
  { id: 8, image: "/agents/agent-8.png" },
  { id: 9, image: "/agents/agent-9.png" }, // Actualizado con la nueva imagen
  { id: 10, image: "/agents/agent-10.png" },
  { id: 11, image: "/agents/agent-11.png" },
  { id: 12, image: "/agents/agent-12.png" },
  { id: 13, image: "/agents/agent-13.png" },
  { id: 14, image: "/agents/kahn-avatar.png" },
  { id: 15, image: "/agents/agent-15.png" },
  { id: 16, image: "/agents/agent-16.png" },
  { id: 17, image: "/agents/agent-17.png" },
  { id: 18, image: "/agents/agent-18.png" },
  { id: 19, image: "/agents/agent-19.png" },
  { id: 20, image: "/agents/agent-20.png" },
  { id: 21, image: "/agents/agent-21.png" },
  { id: 22, image: "/agents/agent-22.png" },
  { id: 23, image: "/agents/agent-23.png" },
  { id: 24, image: "/agents/agent-24.png" },
  { id: 25, image: "/agents/agent-25.png" },
  { id: 26, image: "/agents/agent-26.png" },
  { id: 27, image: "/agents/agent-27.png" },
  { id: 28, image: "/agents/agent-28.png" },
  { id: 29, image: "/agents/agent-29.png" },
]

// Características de la comunidad
const communityFeatures = [
  {
    icon: <PiUsersBold className="h-4 w-4 text-black" />,
    title: "Global Community",
    description: "Join thousands of business travelers from over 120 countries worldwide",
  },
  {
    icon: <PiGlobeBold className="h-4 w-4 text-black" />,
    title: "Industry Leaders",
    description: "Connect with professionals from Fortune 500 companies and innovative startups",
  },
  {
    icon: <PiRocketLaunchBold className="h-4 w-4 text-black" />,
    title: "Knowledge Sharing",
    description: "Access exclusive travel insights and best practices from experienced travelers",
  },
  {
    icon: <PiChartLineUpBold className="h-4 w-4 text-black" />,
    title: "Growth Network",
    description: "Expand your professional network while traveling for business",
  },
  {
    icon: <PiUsersBold className="h-4 w-4 text-black" />,
    title: "Mentorship",
    description: "Learn from seasoned business travelers and industry experts",
  },
  {
    icon: <PiGlobeBold className="h-4 w-4 text-black" />,
    title: "Cultural Exchange",
    description: "Discover diverse perspectives and business practices from around the world",
  },
  {
    icon: <PiRocketLaunchBold className="h-4 w-4 text-black" />,
    title: "Innovation Hub",
    description: "Stay at the forefront of travel technology and business solutions",
  },
  {
    icon: <PiChartLineUpBold className="h-4 w-4 text-black" />,
    title: "Career Advancement",
    description: "Leverage travel experiences to enhance your professional development",
  },
]

// Title variations
const titleVariations = [
  "The business travel community for modern workers",
  "Connect with global business travelers worldwide",
  "Join the network of elite business travelers",
  "The ultimate hub for business travel professionals",
]

// Función mejorada para generar el grid de la comunidad
const generateCommunityGrid = () => {
  const grid = []
  // Generar exactamente 120 miembros (grid de 10×12)
  for (let i = 0; i < 120; i++) {
    // Usar módulo para asegurar una distribución uniforme de todas las imágenes de agentes
    const memberIndex = i % communityMembers.length
    const member = communityMembers[memberIndex]

    grid.push({
      id: `generated-${i}`,
      image: member.image,
    })
  }
  return grid
}

export default function CommunityShowcase() {
  const [communityGrid, setCommunityGrid] = useState<any[]>([])
  const [randomTitle, setRandomTitle] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  useEffect(() => {
    setCommunityGrid(generateCommunityGrid())
    // Seleccionar un título aleatorio
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])
  }, [])

  // Función para manejar la selección de agentes
  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId === selectedAgent ? null : agentId)
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-2">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              Suitpax Community
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Growing Daily
            </span>
          </div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-6xl font-medium tracking-tight text-black leading-tight max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {randomTitle}
          </motion.h2>

          <motion.p
            className="mt-3 text-[10px] font-medium text-gray-500 max-w-xl mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect with forward-thinking business travelers redefining workplace mobility in today's distributed work
            environment
          </motion.p>
        </div>

        <div className="relative mb-12">
          <div className="grid grid-cols-10 gap-1.5 md:gap-2">
            {communityGrid.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.003 }}
                className="aspect-square relative cursor-pointer"
                onClick={() => handleAgentSelect(member.id)}
              >
                {/* Efecto de flujo brillante para el agente seleccionado */}
                <AnimatePresence>
                  {selectedAgent === member.id && (
                    <motion.div
                      className="absolute inset-0 rounded-lg z-10 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0.4, 0.7, 0.4],
                        scale: [0.9, 1.1, 0.9],
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      style={{
                        background: "rgba(6, 95, 70, 0.3)",
                        boxShadow: "0 0 15px 5px rgba(6, 95, 70, 0.2)",
                      }}
                    />
                  )}
                </AnimatePresence>

                <div className="absolute inset-0 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt="Community member"
                    fill
                    className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                    sizes="(max-width: 768px) 30px, (max-width: 1024px) 40px, 50px"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Texto adicional debajo del grid */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-medium tracking-tight text-black mb-8 text-center">
            Join a community of next-generation traveltech innovators
          </h3>

          {/* Single tall vertical card */}
          <motion.div
            className="max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            {/* Card content */}
            <div className="p-8 bg-black/90 rounded-lg">
              <h4 className="font-medium text-white text-xl mb-3 text-left tracking-tighter">
                The unprecedented way to connect
              </h4>
              <p className="text-gray-400 mb-5 text-left text-xs">
                Join an exclusive community of executives, founders, and innovators from the world's leading technology
                and travel companies.
              </p>

              {/* Features list */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-xl p-2 mt-0.5">
                    <PiDotsThreeBold className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white text-sm tracking-tighter">Innovation Exchange</h5>
                    <p className="text-xs text-gray-400">
                      Share ideas with pioneers redefining the future of business travel
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-xl p-2 mt-0.5">
                    <PiDotsThreeBold className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white text-sm tracking-tighter">Executive Network</h5>
                    <p className="text-xs text-gray-400">Connect with decision-makers from Fortune 500 companies</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-xl p-2 mt-0.5">
                    <PiDotsThreeBold className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white text-sm tracking-tighter">Virtual Meetings</h5>
                    <p className="text-xs text-gray-400">Access invitation-only gatherings with industry visionaries</p>
                  </div>
                </div>
              </div>

              {/* Community members preview */}
              <div className="flex flex-col items-start">
                <p className="text-xs text-gray-400 mb-3">Join alongside leaders from top global companies</p>
                <div className="flex -space-x-3 mb-6">
                  {[
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                  ].map((src, index) => (
                    <div key={index} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt="Community member"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                    +120
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 text-center">
          <span className="block text-[10px] text-white/60 mb-2">Coming soon</span>
          <motion.button
            className="inline-flex items-center bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl text-xs font-medium tracking-tighter shadow-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join our community
          </motion.button>
        </div>
      </div>
    </section>
  )
}
