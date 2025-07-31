"use client"

import { motion } from "framer-motion"
import { MdPhone, MdStar } from "react-icons/md"
import Image from "next/image"

const AI_AGENTS = [
  {
    id: "emma",
    name: "Emma",
    role: "Executive Travel Specialist",
    image: "/agents/agent-emma.jpeg",
    rating: 4.9,
    status: "available",
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Corporate Travel Expert",
    image: "/agents/agent-marcus.jpeg",
    rating: 4.8,
    status: "available",
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Concierge & VIP Services",
    image: "/agents/agent-sophia.jpeg",
    rating: 4.9,
    status: "busy",
  },
]

export default function AIVoiceCallingHub() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6"
          >
            <MdPhone className="mr-1.5 h-3 w-3" />
            <em className="font-serif italic">AI Voice Calling</em>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter leading-none mb-6"
          >
            <em className="font-serif italic">Speak with AI Agents</em>
            <br />
            <span className="text-gray-600">Like Real Humans</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm font-medium text-gray-500 max-w-2xl mx-auto"
          >
            Experience the future of business travel support with AI agents that understand context, speak naturally,
            and provide expert assistance through voice conversations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={agent.image || "/placeholder.svg"}
                      alt={agent.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      agent.status === "available" ? "bg-green-500" : "bg-orange-500"
                    }`}
                  ></div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium tracking-tighter truncate">{agent.name}</h3>
                  <p className="text-xs text-gray-600 truncate">
                    <em className="font-serif italic">{agent.role}</em>
                  </p>
                  <div className="flex items-center space-x-1 text-xs mt-1">
                    <MdStar className="h-3 w-3 text-yellow-500" />
                    <span className="font-medium text-gray-700">{agent.rating}</span>
                  </div>
                </div>

                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <MdPhone className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
