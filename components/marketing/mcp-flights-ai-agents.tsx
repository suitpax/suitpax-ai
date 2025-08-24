"use client"

import { motion } from "framer-motion"

const AIRLINE_LOGOS = [
  { name: "Cathay Pacific", url: "https://cdn.brandfetch.io/cathaypacific.com/w/512/h/72/logo" },
  { name: "Transavia", url: "https://cdn.brandfetch.io/transavia.com/w/512/h/92/logo" },
  { name: "Air France", url: "https://cdn.brandfetch.io/airfrance.com/w/512/h/49/logo" },
  { name: "Jet2", url: "https://cdn.brandfetch.io/jet2.com/w/512/h/175/logo" },
  { name: "Vueling", url: "https://cdn.brandfetch.io/vueling.com/w/512/h/169/logo" },
  { name: "KLM", url: "https://cdn.brandfetch.io/klm.com/w/512/h/140/logo" },
  { name: "Iberia", url: "https://cdn.brandfetch.io/iberia.com/w/512/h/180/logo" },
  { name: "Lufthansa", url: "https://cdn.brandfetch.io/lufthansa.com/w/512/h/110/logo" },
  { name: "British Airways", url: "https://cdn.brandfetch.io/britishairways.com/w/512/h/120/logo" },
  { name: "Emirates", url: "https://cdn.brandfetch.io/emirates.com/w/512/h/120/logo" },
]

export default function MCPFlightsAIAgents() {
  return (
    <section className="pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-medium tracking-tighter leading-none mb-2">
            AI Flight Agents
          </h2>
          <p className="text-gray-600 text-sm">
            Seamless connectivity with major airlines
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-black rounded-2xl border border-gray-900 p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {AIRLINE_LOGOS.map((logo, index) => (
              <motion.div
                key={`${logo.name}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                viewport={{ once: true }}
                className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-800 bg-black/80"
              >
                <img src={logo.url} alt={`${logo.name} logo`} className="h-5 w-auto opacity-95" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

