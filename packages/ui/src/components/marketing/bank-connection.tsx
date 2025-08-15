"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { PiLightningBold, PiArrowRightBold, PiCheckCircleBold } from "react-icons/pi"
import BankConnectionModal from "@/components/ui/bank-connection-modal"

// Actualizar el array banks para añadir Wise y Ally
const banks = [
  {
    id: 1,
    name: "Bank of America",
    logo: "https://cdn.brandfetch.io/bankofamerica.com/w/512/h/51/logo?c=1idU-l8vdm7C5__3dci",
    description: "Seamless integration with your corporate accounts",
    quote: "The future of business is digital, and the future of digital is now.",
    author: "Brian Moynihan, CEO",
    features: ["Instant reconciliation", "Corporate card integration", "Real-time expense tracking"],
  },
  {
    id: 2,
    name: "Chase",
    logo: "https://cdn.brandfetch.io/chase.com/w/512/h/95/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    description: "Optimize your business travel expenses automatically",
    quote: "Innovation and technology are reshaping how we serve our clients and communities.",
    author: "Jamie Dimon, CEO",
    features: ["Automated expense categorization", "Travel policy compliance", "Preferred rates"],
  },
  {
    id: 3,
    name: "Wells Fargo",
    logo: "https://cdn.brandfetch.io/wellsfargo.com/w/512/h/52/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    description: "Streamline your corporate travel payments",
    quote: "Technology has transformed banking from a physical experience to one that can happen anywhere.",
    author: "Charles Scharf, CEO",
    features: ["Secure payment processing", "Multi-currency support", "Detailed reporting"],
  },
  {
    id: 4,
    name: "Citi",
    logo: "https://cdn.brandfetch.io/citigroup.com/w/512/h/333/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    description: "Global payment solutions for international business",
    quote: "The future of finance is digital, and we're building that future today.",
    author: "Jane Fraser, CEO",
    features: ["Global payment network", "Foreign exchange optimization", "International expense management"],
  },
  {
    id: 5,
    name: "Capital One",
    logo: "https://cdn.brandfetch.io/capitalone.com/w/512/h/184/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    description: "Smart analytics to optimize your travel budget",
    quote: "Technology is transforming our industry in profound ways, creating new possibilities.",
    author: "Richard Fairbank, Founder & CEO",
    features: ["AI-powered spend analysis", "Budget forecasting", "Savings recommendations"],
  },
  {
    id: 6,
    name: "Wise",
    logo: "https://cdn.brandfetch.io/wise.com/w/512/h/116/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    description: "International payments with real exchange rates",
    quote: "We're making money work without borders - instant, convenient, transparent and eventually free.",
    author: "Kristo Käärmann, CEO",
    features: ["Multi-currency accounts", "Low-cost international transfers", "Business expense cards"],
  },
  {
    id: 7,
    name: "Ally",
    logo: "https://cdn.brandfetch.io/ally.com/w/512/h/293/theme/light/logo?c=1idU-l8vdm7C5__3dci",
    description: "Digital financial services for modern businesses",
    quote:
      "We're reimagining digital financial services through innovative solutions that deliver on what customers want.",
    author: "Jeffrey Brown, CEO",
    features: ["Corporate accounts with no fees", "Advanced mobile banking", "Integrated expense management"],
  },
]

export const BankConnection = () => {
  const [activeBank, setActiveBank] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const userName = "Jules" // Cambiado de "Alex" a "Jules"
  const [connectionProgress, setConnectionProgress] = useState(0)

  const handleConnect = () => {
    setIsConnecting(true)
    setConnectionProgress(0) // Reset progress
    const interval = setInterval(() => {
      setConnectionProgress((prevProgress) => {
        const newProgress = Math.min(prevProgress + 10, 100)
        return newProgress
      })
    }, 150)

    setTimeout(() => {
      clearInterval(interval)
      setIsConnecting(false)
      setIsConnected(true)
      setShowModal(true)
    }, 1500)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setTimeout(() => {
      setIsConnected(false)
      setActiveBank((prev) => (prev + 1) % banks.length)
    }, 500)
  }

  const bank = banks[activeBank]

  return (
    <section className="py-24 relative w-full overflow-hidden bg-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">
              <PiLightningBold className="mr-1 h-3 w-3" />
              Hyperspeed Finance
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-none max-w-4xl">
            Connect your bank. Reduce your costs.
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-medium text-white/70 max-w-2xl mb-12">
            Our Hyperspeed technology connects directly with your financial institutions, automating payments,
            optimizing expenses, and reducing your travel costs by up to 23%.
          </p>

          <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
            {/* Bank connection showcase */}
            <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl">
              <h3 className="text-xl font-medium text-white mb-6">Connect your financial accounts</h3>

              <AnimatePresence mode="wait">
                <motion.div
                  key={bank.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-24 relative bg-white/5 rounded-lg p-2 flex items-center justify-center">
                      <Image
                        src={bank.logo || "/placeholder.svg"}
                        alt={bank.name}
                        width={100}
                        height={40}
                        className="h-8 w-auto object-contain invert brightness-0 filter"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-medium">{bank.name}</h4>
                      <p className="text-xs text-white/70">{bank.description}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 mb-4 text-left">
                    <p className="text-sm text-white/80">"{bank.quote}"</p>
                    <p className="text-xs text-white/60 mt-2">— {bank.author}</p>
                  </div>

                  <ul className="space-y-2 text-left mb-6">
                    {bank.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-white/80">
                        <PiCheckCircleBold className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleConnect}
                    disabled={isConnecting || isConnected}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <>
                        <motion.div className="relative w-full h-0.5 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 h-0.5 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </motion.div>
                        Connecting...
                      </>
                    ) : isConnected ? (
                      <>
                        <PiCheckCircleBold className="h-4 w-4 text-emerald-400" />
                        Connected
                      </>
                    ) : (
                      <>
                        Connect
                        <PiArrowRightBold className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Bank indicators */}
              <div className="flex justify-center mt-4 gap-2">
                {banks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveBank(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      activeBank === index ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Benefits showcase */}
            <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-black to-black/80 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <PiLightningBold className="h-3 w-3 text-emerald-400" />
                      </div>
                      <h4 className="text-white text-sm font-medium">Instant payments</h4>
                    </div>
                    <p className="text-xs text-white/70">
                      Process travel payments in milliseconds, not days. Our Hyperspeed technology eliminates delays.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-black to-black/80 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg
                          className="h-3 w-3 text-emerald-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 6V18M18 12H6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h4 className="text-white text-sm font-medium">Cost reduction</h4>
                    </div>
                    <p className="text-xs text-white/70">
                      Our AI analyzes spending patterns to identify savings opportunities and negotiate better rates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black p-4 border-t border-white/10">
                {/* Título de la sección */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-medium text-sm">Average savings</p>
                    <p className="text-xs text-white/70">For enterprise customers</p>
                  </div>
                  <div className="text-right">
                    {/* Número animado con contador */}
                    <motion.p
                      className="text-2xl font-bold text-white"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 0.3 },
                        }}
                      >
                        23
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { delay: 0.5 },
                        }}
                      >
                        %
                      </motion.span>
                    </motion.p>
                    <p className="text-xs text-emerald-400">Year over year</p>
                  </div>
                </div>

                {/* Ventajas adicionales */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                    <motion.p
                      className="text-lg font-bold text-white flex items-center justify-center"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      45%
                    </motion.p>
                    <p className="text-[10px] text-center text-white/60">Time saved on expense reports</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                    <motion.p
                      className="text-lg font-bold text-white flex items-center justify-center"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      3.2x
                    </motion.p>
                    <p className="text-[10px] text-center text-white/60">Faster payment processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-3xl mx-auto mt-12">
            {banks.map((bank) => (
              <div key={bank.id} className="h-6 relative opacity-60 hover:opacity-100 transition-opacity">
                <Image
                  src={bank.logo || "/placeholder.svg"}
                  alt={bank.name}
                  width={80}
                  height={24}
                  className="h-4 w-auto object-contain invert brightness-0 filter"
                />
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-white/60 max-w-lg">
            Currently, Suitpax only supports connections with major banks in the United States and Canada. More
            international banking partners coming soon.
          </p>
        </div>
      </div>

      {/* Modal de conexión exitosa - Ahora usando el componente separado */}
      <AnimatePresence>
        {showModal && (
          <BankConnectionModal isOpen={showModal} onClose={handleCloseModal} bankName={bank.name} userName={userName} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default BankConnection
