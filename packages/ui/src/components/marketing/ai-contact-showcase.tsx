"use client"

import { motion } from "framer-motion"

export default function AIContactShowcase() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-200/40 via-transparent to-transparent opacity-70"></div>
      <div className="absolute inset-0 bg-[url('/images/chaotic-gradients-bg.jpg')] bg-cover opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <img src="/logo/suitpax-symbol.webp" alt="Suitpax" className="w-3 h-3 mr-1.5" />
            Suitpax AI
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter text-black leading-none max-w-4xl mx-auto mb-4">
            Elevate your travel experience with our AI agents
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Our team of specialized AI travel agents is ready to assist with every aspect of your business travel needs,
            from booking to expense management.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative w-full max-w-2xl bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-200/30 via-transparent to-transparent rounded-2xl -z-10"></div>

            <div className="text-center mb-6">
              <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <div className="absolute inset-1 bg-white rounded-xl shadow-sm"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-700 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2 tracking-tighter">Connect with Suitpax</h3>
              <p className="text-sm text-gray-600 font-light mb-4">
                Get personalized assistance from our AI team or schedule a demo with our founders
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { img: "/agents/agent-marcus.jpeg", name: "Marcus", role: "Flight Specialist" },
                { img: "/agents/agent-sophia.jpeg", name: "Sophia", role: "Hotel Expert" },
                { img: "/agents/agent-emma.jpeg", name: "Emma", role: "Expense Manager" },
                { img: "/agents/agent-alex.jpeg", name: "Alex", role: "Executive Travel" },
                { img: "/agents/agent-zara.jpeg", name: "Zara", role: "Policy Compliance" },
                { img: "/agents/agent-luna.jpeg", name: "Luna", role: "Travel Analytics" },
              ].map((agent, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={agent.img || "/placeholder.svg"}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-medium text-gray-900 block">{agent.name}</span>
                    <span className="text-[9px] text-gray-500 block">{agent.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Response within 2 hours
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <a
                href="mailto:ai@suitpax.com?subject=Sign%20In%20Request&body=I'd%20like%20to%20sign%20in%20to%20Suitpax.%20Please%20provide%20access."
                className="block w-full py-3 px-4 bg-black text-white hover:bg-gray-800 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg"
              >
                Sign in
              </a>

              <a
                href="mailto:ai@suitpax.com?subject=Pre-register%20Request&body=I'd%20like%20to%20pre-register%20for%20Suitpax.%20Please%20add%20me%20to%20the%20waitlist."
                className="block w-full py-3 px-4 bg-transparent border border-black text-black hover:bg-gray-50 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-md"
              >
                Pre-register
              </a>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {["/founders/alberto-new.webp", "/founders/alexis.webp"].map((img, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-white overflow-hidden">
                      <img src={img || "/placeholder.svg"} alt="Founder" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">ai@suitpax.com</p>
                  <p className="text-xs text-gray-400">Available this week</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
