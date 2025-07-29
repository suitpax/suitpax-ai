"use client"

import { motion } from "framer-motion"
import { Globe, Users, Building2, Clock } from "lucide-react"

const GLOBAL_HUBS = [
  {
    city: "Madrid",
    country: "España",
    timezone: "CET",
    agents: 12,
    coordinates: { x: 48, y: 35 },
    status: "active",
  },
  {
    city: "Londres",
    country: "Reino Unido",
    timezone: "GMT",
    agents: 8,
    coordinates: { x: 45, y: 28 },
    status: "active",
  },
  {
    city: "París",
    country: "Francia",
    timezone: "CET",
    agents: 6,
    coordinates: { x: 49, y: 32 },
    status: "active",
  },
  {
    city: "Frankfurt",
    country: "Alemania",
    timezone: "CET",
    agents: 10,
    coordinates: { x: 52, y: 30 },
    status: "active",
  },
  {
    city: "Nueva York",
    country: "Estados Unidos",
    timezone: "EST",
    agents: 15,
    coordinates: { x: 25, y: 35 },
    status: "active",
  },
  {
    city: "Tokio",
    country: "Japón",
    timezone: "JST",
    agents: 9,
    coordinates: { x: 85, y: 40 },
    status: "active",
  },
]

export default function SuitpaxHubMap() {
  return (
    <section className="py-12 bg-black">
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
            <Globe className="mr-1.5 h-3 w-3" />
            Red Global
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white mb-6"
          >
            Equipo Global Conectado
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Nuestros agentes IA están distribuidos globalmente para brindarte soporte 24/7 en cualquier zona horaria
          </motion.p>
        </div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 mb-12"
        >
          {/* World Map Outline */}
          <div className="relative w-full h-96 bg-gray-900/50 rounded-xl overflow-hidden">
            {/* Simplified world map background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <path
                  d="M10,30 Q20,25 30,30 T50,30 Q60,25 70,30 T90,30"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  className="text-gray-600"
                />
                <path
                  d="M15,40 Q25,35 35,40 T55,40 Q65,35 75,40 T85,40"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  className="text-gray-600"
                />
              </svg>
            </div>

            {/* Hub Points */}
            {GLOBAL_HUBS.map((hub, index) => (
              <motion.div
                key={hub.city}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${hub.coordinates.x}%`,
                  top: `${hub.coordinates.y}%`,
                }}
              >
                {/* Pulse Animation */}
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>

                {/* Hub Point */}
                <div className="relative w-3 h-3 bg-white rounded-full border-2 border-gray-800 shadow-lg">
                  <div className="absolute inset-0.5 bg-gray-200 rounded-full"></div>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium text-gray-900 whitespace-nowrap shadow-lg border border-gray-200">
                    <div className="font-medium">{hub.city}</div>
                    <div className="text-gray-600">
                      {hub.agents} agentes • {hub.timezone}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {GLOBAL_HUBS.map((hub, index) => {
                if (index === 0) return null
                const prevHub = GLOBAL_HUBS[index - 1]
                return (
                  <motion.line
                    key={`line-${index}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.2 }}
                    viewport={{ once: true }}
                    x1={`${prevHub.coordinates.x}%`}
                    y1={`${prevHub.coordinates.y}%`}
                    x2={`${hub.coordinates.x}%`}
                    y2={`${hub.coordinates.y}%`}
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )
              })}
            </svg>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Agentes Globales</h3>
                <p className="text-sm text-gray-400">Disponibles 24/7</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">60+</div>
            <p className="text-sm text-gray-400">Agentes IA especializados en viajes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Tiempo de Respuesta</h3>
                <p className="text-sm text-gray-400">Promedio global</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{"<2s"}</div>
            <p className="text-sm text-gray-400">Respuesta instantánea garantizada</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Ciudades</h3>
                <p className="text-sm text-gray-400">Centros operativos</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">6</div>
            <p className="text-sm text-gray-400">Hubs principales en 4 continentes</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
