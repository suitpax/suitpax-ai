"use client"

import { motion } from "framer-motion"
import { Phone, Mic, Volume2, Clock, Star } from "lucide-react"
import Image from "next/image"

const AI_AGENTS = [
  {
    id: "emma",
    name: "Emma",
    role: "Especialista en Vuelos",
    image: "/agents/agent-emma.jpeg",
    languages: ["Español", "Inglés", "Francés"],
    specialties: ["Reservas de vuelos", "Cambios de itinerario", "Upgrades"],
    rating: 4.9,
    callsToday: 127,
    status: "available",
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Experto en Hoteles",
    image: "/agents/agent-marcus.jpeg",
    languages: ["Español", "Inglés", "Alemán"],
    specialties: ["Reservas hoteleras", "Servicios VIP", "Concierge"],
    rating: 4.8,
    callsToday: 89,
    status: "available",
  },
]

export default function AIVoiceCallingHub() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6"
          >
            <Phone className="mr-1.5 h-3 w-3" />
            Llamadas IA
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6"
          >
            Habla con Nuestros
            <br />
            <span className="text-gray-600">Agentes IA</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg font-light text-gray-600 max-w-2xl mx-auto"
          >
            Conversaciones naturales por voz con agentes especializados en viajes de negocio. Disponibles 24/7 en
            múltiples idiomas.
          </motion.p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {AI_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Agent Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-medium tracking-tighter mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{agent.role}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-gray-400 fill-current" />
                      <span className="text-xs font-medium text-gray-700">{agent.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">{agent.callsToday} llamadas hoy</span>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Idiomas:</p>
                <div className="flex flex-wrap gap-1">
                  {agent.languages.map((language) => (
                    <span
                      key={language}
                      className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-700 mb-2">Especialidades:</p>
                <div className="space-y-1">
                  {agent.specialties.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">{specialty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call Button */}
              <button className="w-full bg-black text-white rounded-xl py-3 px-4 font-medium text-sm hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Llamar a {agent.name}</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mic className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium tracking-tighter mb-2">Reconocimiento de Voz</h3>
              <p className="text-sm font-light text-gray-600">
                Tecnología avanzada de procesamiento de lenguaje natural para conversaciones fluidas
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium tracking-tighter mb-2">Síntesis de Voz</h3>
              <p className="text-sm font-light text-gray-600">
                Voces naturales y expresivas que se adaptan al contexto de la conversación
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-medium tracking-tighter mb-2">Disponibilidad 24/7</h3>
              <p className="text-sm font-light text-gray-600">
                Soporte continuo sin importar tu zona horaria o ubicación geográfica
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
