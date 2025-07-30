"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PiPaperPlaneTiltBold, PiMicrophone, PiPlay } from "react-icons/pi"
import { useState, useRef, useEffect } from "react"

const airlines = [
  { name: "American Airlines", logo: "/logos/airlines/american-airlines.svg" },
  { name: "KLM", logo: "/logos/airlines/klm.svg" },
  { name: "Japan Airlines", logo: "/logos/airlines/jal.svg" },
  { name: "Qatar Airways", logo: "/logos/airlines/qatar.svg" },
  { name: "British Airways", logo: "/logos/airlines/british-airways.svg" },
  { name: "Southwest", logo: "/logos/airlines/southwest.svg" },
  { name: "Iberia", logo: "/logos/airlines/iberia.svg" },
  { name: "Air Canada", logo: "/logos/airlines/air-canada.svg" },
  { name: "Emirates", logo: "/logos/airlines/emirates.svg" },
  { name: "Lufthansa", logo: "/logos/airlines/lufthansa.svg" },
  { name: "Air France", logo: "/logos/airlines/air-france.svg" },
  { name: "Delta", logo: "/logos/airlines/delta.svg" },
]

const REAL_FLIGHT_EXAMPLES = [
  { route: "JFK → LHR", price: "$1,245", time: "7h 15m", class: "Business" },
  { route: "LAX → NRT", price: "$2,890", time: "11h 30m", class: "First" },
  { route: "MAD → CDG", price: "$189", time: "1h 25m", class: "Economy" },
  { route: "FRA → SIN", price: "$1,567", time: "12h 45m", class: "Premium" },
  { route: "DXB → SYD", price: "$2,134", time: "14h 20m", class: "Business" },
  { route: "LGW → BCN", price: "$156", time: "2h 10m", class: "Economy" },
]

const duplicatedAirlines = [...airlines, ...airlines]

export default function MCPFlightsAIAgents() {
  const [isListening, setIsListening] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentExample, setCurrentExample] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % REAL_FLIGHT_EXAMPLES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const handleVoiceSearch = () => {
    setIsListening(!isListening)
    // Aquí iría la lógica de reconocimiento de voz
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Tech Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-none mb-8 text-white"
          >
            <em className="font-serif italic">Búsqueda de vuelos</em>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              con IA conversacional
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl font-light text-gray-300 max-w-4xl mx-auto mb-12"
          >
            Habla directamente con nuestros agentes IA. Búsqueda inteligente de vuelos con procesamiento de lenguaje
            natural y recomendaciones personalizadas en tiempo real.
          </motion.p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* AI Agent Video Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Image
                    src="/agents/agent-luna-new.png"
                    alt="Luna AI Agent"
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full border-2 border-cyan-400 object-cover shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Luna</h3>
                  <p className="text-sm text-gray-400">Especialista en Vuelos Empresariales</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Online • Listo para ayudar</span>
                  </div>
                </div>
              </div>

              {/* Video Container */}
              <div className="relative bg-gray-800/50 rounded-2xl overflow-hidden mb-6 aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  poster="/agents/agent-luna-new.png"
                >
                  <source src="/videos/ai-agent-demo.mp4" type="video/mp4" />
                </video>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    onClick={handleVideoPlay}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <PiPlay className="w-6 h-6 text-white ml-1" />
                  </motion.button>
                </div>

                {/* Audio Waveform Visualization */}
                {isVideoPlaying && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 h-8">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-cyan-400 rounded-full"
                          style={{ width: "3px" }}
                          animate={{
                            height: [4, Math.random() * 20 + 4, 4],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-300 mb-4">
                  "Hola, soy Luna. Puedo ayudarte a encontrar el vuelo perfecto para tu viaje de negocios."
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-400/30">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-cyan-300">Procesando lenguaje natural</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
              <h3 className="text-2xl font-medium text-white mb-6">
                <em className="font-serif italic">Búsqueda Inteligente</em>
              </h3>

              {/* Voice/Text Input */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Habla o escribe: 'Necesito un vuelo business de Madrid a Londres para mañana'"
                  className="w-full pl-6 pr-20 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all font-light text-lg"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                  <motion.button
                    onClick={handleVoiceSearch}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      isListening ? "bg-red-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PiMicrophone className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PiPaperPlaneTiltBold className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Real-time Flight Examples */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Ejemplos de búsquedas populares:</p>
                <div className="flex flex-wrap gap-2">
                  {REAL_FLIGHT_EXAMPLES.slice(0, 3).map((example, index) => (
                    <motion.button
                      key={index}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-gray-300 transition-all duration-300 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {example.route} • {example.price}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Live Flight Data */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">Vuelos en Tiempo Real</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                </div>

                <motion.div
                  key={currentExample}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div>
                    <div className="text-white font-medium">{REAL_FLIGHT_EXAMPLES[currentExample].route}</div>
                    <div className="text-xs text-gray-400">
                      {REAL_FLIGHT_EXAMPLES[currentExample].time} • {REAL_FLIGHT_EXAMPLES[currentExample].class}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">{REAL_FLIGHT_EXAMPLES[currentExample].price}</div>
                    <div className="text-xs text-gray-400">desde</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Airlines Logos - Minimalist Black Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="w-full overflow-hidden mb-8"
        >
          <p className="text-center text-gray-400 text-sm mb-6">Conectado con más de 400 aerolíneas globales</p>
          <div className="relative h-12">
            <motion.div
              className="absolute left-0 flex items-center"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Number.POSITIVE_INFINITY }}
            >
              {duplicatedAirlines.map((airline, index) => (
                <div key={`airline-${index}`} className="flex-shrink-0 mx-6" style={{ width: "80px" }}>
                  <div className="w-20 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <span className="text-xs font-medium text-white/80 truncate px-2">
                      {airline.name.split(" ")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Tech Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiMicrophone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Reconocimiento de Voz</h3>
            <p className="text-sm text-gray-400">Búsqueda por voz en múltiples idiomas con IA conversacional</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiPaperPlaneTiltBold className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Búsqueda Inteligente</h3>
            <p className="text-sm text-gray-400">Algoritmos avanzados que entienden contexto y preferencias</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PiPlay className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Tiempo Real</h3>
            <p className="text-sm text-gray-400">Precios y disponibilidad actualizados cada segundo</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
