"use client"

import { motion } from "framer-motion"
import { Users, Clock, MapPin, Zap, Network } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

const GLOBAL_HUBS = [
  {
    city: "Madrid",
    country: "España",
    timezone: "CET",
    agents: 12,
    coordinates: { x: 48, y: 35 },
    status: "active",
    users: [
      { name: "Alberto Zurano", avatar: "/founders/alberto-new.webp", role: "Founder" },
      { name: "Ammar Foley", avatar: "/community/ammar-foley.webp", role: "Business Dev" },
      { name: "Owen Harding", avatar: "/community/owen-harding.webp", role: "Product" },
    ],
    activeConnections: 8,
    liveBookings: 3,
  },
  {
    city: "Londres",
    country: "Reino Unido",
    timezone: "GMT",
    agents: 8,
    coordinates: { x: 45, y: 28 },
    status: "active",
    users: [
      { name: "Jordan Burgess", avatar: "/community/jordan-burgess.webp", role: "Sales" },
      { name: "Adil Floyd", avatar: "/community/adil-floyd.webp", role: "Engineering" },
      { name: "Nicolas Trevino", avatar: "/community/nicolas-trevino.webp", role: "Marketing" },
    ],
    activeConnections: 12,
    liveBookings: 5,
  },
  {
    city: "París",
    country: "Francia",
    timezone: "CET",
    agents: 6,
    coordinates: { x: 49, y: 32 },
    status: "active",
    users: [
      { name: "Ashton Blackwell", avatar: "/community/ashton-blackwell.webp", role: "Design" },
      { name: "Scott Clayton", avatar: "/community/scott-clayton.webp", role: "Operations" },
    ],
    activeConnections: 6,
    liveBookings: 2,
  },
  {
    city: "Frankfurt",
    country: "Alemania",
    timezone: "CET",
    agents: 10,
    coordinates: { x: 52, y: 30 },
    status: "active",
    users: [
      { name: "Bec Ferguson", avatar: "/community/bec-ferguson.webp", role: "Finance" },
      { name: "Byron Robertson", avatar: "/community/byron-robertson.webp", role: "Legal" },
    ],
    activeConnections: 9,
    liveBookings: 4,
  },
  {
    city: "Nueva York",
    country: "Estados Unidos",
    timezone: "EST",
    agents: 15,
    coordinates: { x: 25, y: 35 },
    status: "active",
    users: [
      { name: "Isobel Fuller", avatar: "/community/isobel-fuller.webp", role: "Strategy" },
      { name: "Lana Steiner", avatar: "/community/lana-steiner.jpg", role: "Growth" },
      { name: "Nikolas Gibbons", avatar: "/community/nikolas-gibbons.jpg", role: "Partnerships" },
    ],
    activeConnections: 15,
    liveBookings: 7,
  },
  {
    city: "Tokio",
    country: "Japón",
    timezone: "JST",
    agents: 9,
    coordinates: { x: 85, y: 40 },
    status: "active",
    users: [
      { name: "Kelsey Lowe", avatar: "/community/kelsey-lowe.webp", role: "Regional" },
      { name: "Brianna Ware", avatar: "/community/brianna-ware.webp", role: "Support" },
    ],
    activeConnections: 11,
    liveBookings: 6,
  },
]

const LIVE_CONNECTIONS = [
  { from: 0, to: 1, strength: 0.8, type: "collaboration" },
  { from: 1, to: 4, strength: 0.9, type: "meeting" },
  { from: 2, to: 3, strength: 0.7, type: "project" },
  { from: 4, to: 5, strength: 0.6, type: "travel" },
  { from: 0, to: 3, strength: 0.8, type: "partnership" },
  { from: 1, to: 2, strength: 0.5, type: "consultation" },
]

export default function SuitpaxHubMap() {
  const [selectedHub, setSelectedHub] = useState<number | null>(null)
  const [liveData, setLiveData] = useState({
    totalConnections: 0,
    activeBookings: 0,
    onlineUsers: 0,
  })

  useEffect(() => {
    // Simular datos en tiempo real
    const interval = setInterval(() => {
      setLiveData({
        totalConnections: Math.floor(Math.random() * 20) + 45,
        activeBookings: Math.floor(Math.random() * 10) + 15,
        onlineUsers: Math.floor(Math.random() * 50) + 120,
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white/80 mb-6 border border-white/20"
          >
            <Network className="mr-2 h-4 w-4" />
            Red Global Conectada • En Tiempo Real
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white mb-6 leading-none"
          >
            <em className="font-serif italic">Conectando equipos</em>
            <br />
            <span className="text-gray-300">globalmente</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg font-light text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Nuestra plataforma conecta a equipos distribuidos globalmente, facilitando la colaboración y gestión de
            viajes empresariales en tiempo real.
          </motion.p>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{liveData.totalConnections}</div>
              <div className="text-xs text-gray-400">Conexiones Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{liveData.activeBookings}</div>
              <div className="text-xs text-gray-400">Reservas en Curso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{liveData.onlineUsers}</div>
              <div className="text-xs text-gray-400">Usuarios Online</div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 mb-12 shadow-2xl"
        >
          {/* World Map Container */}
          <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden border border-white/10">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {LIVE_CONNECTIONS.map((connection, index) => {
                const fromHub = GLOBAL_HUBS[connection.from]
                const toHub = GLOBAL_HUBS[connection.to]
                return (
                  <motion.g key={`connection-${index}`}>
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: connection.strength }}
                      transition={{ duration: 2, delay: 1 + index * 0.2 }}
                      viewport={{ once: true }}
                      x1={`${fromHub.coordinates.x}%`}
                      y1={`${fromHub.coordinates.y}%`}
                      x2={`${toHub.coordinates.x}%`}
                      y2={`${toHub.coordinates.y}%`}
                      stroke="url(#connectionGradient)"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                    {/* Animated Data Flow */}
                    <motion.circle
                      r="3"
                      fill="#60A5FA"
                      className="drop-shadow-lg"
                      animate={{
                        cx: [`${fromHub.coordinates.x}%`, `${toHub.coordinates.x}%`],
                        cy: [`${fromHub.coordinates.y}%`, `${toHub.coordinates.y}%`],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.5,
                        ease: "linear",
                      }}
                    />
                  </motion.g>
                )
              })}
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hub Points */}
            {GLOBAL_HUBS.map((hub, index) => (
              <motion.div
                key={hub.city}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${hub.coordinates.x}%`,
                  top: `${hub.coordinates.y}%`,
                }}
                onClick={() => setSelectedHub(selectedHub === index ? null : index)}
              >
                {/* Pulse Rings */}
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                  <div className="absolute inset-2 rounded-full bg-purple-400 animate-ping opacity-30 animation-delay-1000"></div>
                </div>

                {/* Hub Core */}
                <motion.div
                  className="relative w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white shadow-lg"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="absolute inset-1 bg-white rounded-full opacity-80"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                </motion.div>

                {/* User Avatars */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex -space-x-1">
                  {hub.users.slice(0, 3).map((user, userIndex) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 + userIndex * 0.05 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full border border-white object-cover shadow-sm"
                      />
                      {userIndex === 0 && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Hub Info Tooltip */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{
                    opacity: selectedHub === index ? 1 : 0,
                    scale: selectedHub === index ? 1 : 0.8,
                    y: selectedHub === index ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 pointer-events-none"
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 text-xs font-medium text-gray-900 whitespace-nowrap shadow-xl border border-gray-200 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm">{hub.city}</div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-600 text-xs">Live</span>
                      </div>
                    </div>
                    <div className="text-gray-600 mb-2">
                      {hub.country} • {hub.timezone}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">Conexiones</div>
                        <div className="font-semibold text-blue-600">{hub.activeConnections}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Reservas</div>
                        <div className="font-semibold text-purple-600">{hub.liveBookings}</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-gray-500 mb-1">Equipo Online</div>
                      <div className="flex -space-x-1">
                        {hub.users.map((user, userIndex) => (
                          <div key={user.name} className="relative group">
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={16}
                              height={16}
                              className="w-4 h-4 rounded-full border border-white object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Equipos Conectados</h3>
                <p className="text-sm text-gray-400">Colaboración global</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">150+</div>
            <p className="text-sm text-gray-400">Empresas usando la plataforma</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Tiempo de Respuesta</h3>
                <p className="text-sm text-gray-400">Velocidad promedio</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{"<1.2s"}</div>
            <p className="text-sm text-gray-400">Respuesta instantánea garantizada</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Ciudades Conectadas</h3>
                <p className="text-sm text-gray-400">Hubs principales</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">25+</div>
            <p className="text-sm text-gray-400">Centros operativos globales</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Disponibilidad</h3>
                <p className="text-sm text-gray-400">Uptime garantizado</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <p className="text-sm text-gray-400">Servicio 24/7 sin interrupciones</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
