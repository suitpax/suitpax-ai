"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const agents = [
  { id: 1, name: "Luna", avatar: "/agents/agent-42.png" },
  { id: 2, name: "Kahn", avatar: "/agents/kahn-avatar.png" },
  { id: 3, name: "Winter", avatar: "/agents/agent-52.png" },
  { id: 4, name: "Sophia", avatar: "/agents/agent-17.png" },
  { id: 5, name: "Zara", avatar: "/agents/agent-21.png" },
  { id: 6, name: "Nova", avatar: "/agents/agent-36.png" },
  { id: 7, name: "Lily", avatar: "/agents/agent-56.png" },
  { id: 8, name: "Alex", avatar: "/agents/agent-8.png" },
]

export default function AITravelAgents() {
  return (
    <section className="pt-12 pb-6 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-black leading-none mb-2">
            MCP-powered AI Agents
          </h2>
          <p className="text-xs font-medium text-gray-500 max-w-2xl mx-auto">
            Context-aware agents that orchestrate business travel tasks end-to-end
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-5 max-w-3xl mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <Image src={agent.avatar} alt={agent.name} fill className="object-cover" />
                </div>
                <div className="mt-1 text-[10px] text-gray-700 font-medium truncate">{agent.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

