"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Globe, BadgePercent, Headset, Zap, ArrowRight } from "lucide-react"

// Mini Chat para Vuelos
const FlightsMiniChat = () => {
  return (
    <motion.div
      className="relative flex items-center gap-2 p-2 rounded-xl border border-gray-200/20 bg-black/20 backdrop-blur-sm shadow-sm w-auto max-w-[320px] mx-auto"
      whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
    >
      <div className="relative w-8 h-8 overflow-hidden rounded-xl border border-gray-200/20">
        <Image
          src="/agents/kahn-avatar.png"
          alt="Suitpax AI Agent"
          width={32}
          height={32}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-0.5 px-1.5 text-[10px] text-gray-300 h-8 flex items-center overflow-hidden">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          Find a business class flight from JFK to LHR...
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 mr-1" />
    </motion.div>
  )
}

// Componente de aerolínea
const AirlineIcon = ({ logo, name }) => {
  return (
    <div className="flex justify-center items-center p-2 rounded-xl transition-all hover:bg-gray-800/50">
      <Image
        src={logo || "/placeholder.svg"}
        alt={name}
        width={100}
        height={40}
        className="h-8 w-auto object-contain brightness-0 invert"
      />
    </div>
  )
}

const airlines = [
  {
    name: "American Airlines",
    logo: "https://cdn.brandfetch.io/aa.com/w/512/h/78/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  { name: "KLM", logo: "https://cdn.brandfetch.io/klm.com/w/512/h/69/logo?c=1idU-l8vdm7C5__3dci" },
  {
    name: "Japan Airlines",
    logo: "https://cdn.brandfetch.io/jal.com/w/512/h/49/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Qatar Airways",
    logo: "https://cdn.brandfetch.io/qatarairways.com/w/512/h/144/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "British Airways",
    logo: "https://cdn.brandfetch.io/britishairways.com/w/512/h/80/logo?c=1idU-l8vdm7C5__3dci",
  },
  { name: "Iberia", logo: "https://cdn.brandfetch.io/iberia.com/w/512/h/114/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
  {
    name: "Air Canada",
    logo: "https://cdn.brandfetch.io/aircanada.com/w/512/h/67/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Emirates",
    logo: "https://cdn.brandfetch.io/emirates.com/w/512/h/95/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  { name: "Lufthansa", logo: "https://cdn.brandfetch.io/lufthansa.com/w/512/h/103/logo?c=1idU-l8vdm7C5__3dci" },
  {
    name: "Singapore Airlines",
    logo: "https://cdn.brandfetch.io/singaporeair.com/w/512/h/74/logo?c=1idU-l8vdm7C5__3dci",
  },
]

const MCPFlightsShowcase = () => {
  return (
    <section className="w-full bg-black py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Disruptive elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-sky-500/10 to-emerald-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/10 to-sky-500/10 blur-3xl animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-xl bg-gray-200/10 border border-gray-200/20 px-2.5 py-0.5 text-[10px] font-medium text-gray-200 mb-3">
              <Image
                src="/logo/suitpax-symbol.webp"
                alt="Suitpax"
                width={16}
                height={16}
                className="mr-1.5 h-3.5 w-auto"
              />
              MCP-Powered Flights
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter leading-tight mb-4 py-2">
              <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                Your Personal AI Flight Agent
              </span>
            </h2>

            <p className="mt-4 text-sm font-medium text-gray-400 max-w-2xl mx-auto mb-6">
              Our AI agents, powered by the Model Context Protocol, understand your travel needs to find the perfect
              flight options for you and your team.
            </p>

            <div className="mt-4 max-w-xs mx-auto">
              <FlightsMiniChat />
            </div>
          </div>

          {/* Flight Showcase */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="rounded-xl border border-gray-500/20 p-2.5 bg-black/20 backdrop-blur-sm">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-gray-200/10">
                <Image
                  src="/images/flight-showcase-dark.png"
                  alt="Flight Booking Interface"
                  width={1200}
                  height={750}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Feature badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">Global Coverage</div>
                      <div className="text-[8px] text-gray-400">10,000+ airlines</div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <BadgePercent className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">Best Prices</div>
                      <div className="text-[8px] text-gray-400">AI-powered savings</div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <Headset className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">24/7 Support</div>
                      <div className="text-[8px] text-gray-400">Human + AI assistance</div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-gray-200/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gray-300" />
                    <div>
                      <div className="text-[10px] text-gray-300 font-medium">Instant Booking</div>
                      <div className="text-[8px] text-gray-400">One-click confirmation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Airline Grid */}
          <div className="mb-8">
            <h3 className="text-center text-lg text-gray-300 font-medium tracking-tighter mb-6">
              Connected with all major airlines
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-6 max-w-3xl mx-auto items-center">
              {airlines.map((airline) => (
                <AirlineIcon key={airline.name} logo={airline.logo} name={airline.name} />
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10 text-center">
              <div className="text-4xl font-medium text-white mb-2">90%</div>
              <div className="text-sm text-gray-400">Less time booking</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10 text-center">
              <div className="text-4xl font-medium text-white mb-2">30%</div>
              <div className="text-sm text-gray-400">Average savings</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10 text-center">
              <div className="text-4xl font-medium text-white mb-2">24/7</div>
              <div className="text-sm text-gray-400">AI travel support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MCPFlightsShowcase
