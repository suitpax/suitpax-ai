"use client"

import { motion } from "framer-motion"
import { MdPhone, MdMic, MdVolumeUp, MdSchedule, MdStar, MdLanguage, MdHeadset } from "react-icons/md"
import { HiGlobeAlt } from "react-icons/hi"
import Image from "next/image"

const AI_AGENTS = [
  {
    id: "emma",
    name: "Emma",
    role: "Executive Travel Specialist",
    image: "/agents/agent-emma.jpeg",
    languages: ["English", "Spanish", "French"],
    specialties: ["Flight bookings", "Luxury accommodations", "VIP services"],
    rating: 4.9,
    callsToday: 127,
    status: "available",
    responseTime: "< 2s",
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Corporate Travel Expert",
    image: "/agents/agent-marcus.jpeg",
    languages: ["English", "German", "Italian"],
    specialties: ["Policy compliance", "Group bookings", "Cost optimization"],
    rating: 4.8,
    callsToday: 89,
    status: "available",
    responseTime: "< 3s",
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Concierge & VIP Services",
    image: "/agents/agent-sophia.jpeg",
    languages: ["English", "French", "Portuguese"],
    specialties: ["Fine dining", "Exclusive events", "Personal concierge"],
    rating: 4.9,
    callsToday: 156,
    status: "available",
    responseTime: "< 2s",
  },
]

const VOICE_FEATURES = [
  {
    icon: MdMic,
    title: "Natural Speech Recognition",
    description: "Advanced AI understands context, accents, and business terminology",
    stats: "99.7% accuracy",
  },
  {
    icon: MdVolumeUp,
    title: "Human-like Voice Synthesis",
    description: "Expressive, natural-sounding voices that adapt to conversation context",
    stats: "12 languages",
  },
  {
    icon: MdSchedule,
    title: "24/7 Global Availability",
    description: "Round-the-clock support across all time zones and regions",
    stats: "< 2s response",
  },
  {
    icon: HiGlobeAlt,
    title: "Multi-language Support",
    description: "Seamless conversations in your preferred language",
    stats: "12+ languages",
  },
]

export default function AIVoiceCallingHub() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
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
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6"
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
            className="text-lg font-light text-gray-600 max-w-3xl mx-auto"
          >
            Experience the future of business travel support with AI agents that understand context, speak naturally,
            and provide expert assistance through voice conversations.
          </motion.p>
        </div>

        {/* Voice Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {VOICE_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="font-medium tracking-tighter mb-2">{feature.title}</h3>
              <p className="text-xs font-light text-gray-600 mb-3">{feature.description}</p>
              <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                {feature.stats}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
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
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium tracking-tighter mb-1">{agent.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    <em className="font-serif italic">{agent.role}</em>
                  </p>
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <MdStar className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium text-gray-700">{agent.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{agent.callsToday} calls today</span>
                  </div>
                </div>
              </div>

              {/* Agent Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-medium tracking-tighter text-gray-900">{agent.responseTime}</div>
                  <div className="text-xs text-gray-600">
                    <em className="font-serif italic">Response Time</em>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-medium tracking-tighter text-gray-900">{agent.languages.length}</div>
                  <div className="text-xs text-gray-600">
                    <em className="font-serif italic">Languages</em>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Languages:</em>
                </p>
                <div className="flex flex-wrap gap-1">
                  {agent.languages.map((language) => (
                    <span
                      key={language}
                      className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700"
                    >
                      <MdLanguage className="h-2.5 w-2.5 mr-1" />
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  <em className="font-serif italic">Specialties:</em>
                </p>
                <div className="space-y-1">
                  {agent.specialties.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600">
                        <em className="font-serif italic">{specialty}</em>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call Button */}
              <button className="w-full bg-black text-white rounded-xl py-3 px-4 font-medium text-sm hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2">
                <MdPhone className="h-4 w-4" />
                <span>
                  <em className="font-serif italic">Call {agent.name}</em>
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-8 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-medium tracking-tighter mb-4">
              <em className="font-serif italic">Ready to Experience AI Voice?</em>
            </h3>
            <p className="text-gray-600 font-light mb-6">
              Join thousands of business travelers who trust our AI agents for their travel needs. Start a conversation
              today and discover the future of travel assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2">
                <MdHeadset className="h-4 w-4" />
                <span>
                  <em className="font-serif italic">Try Voice Demo</em>
                </span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
                <em className="font-serif italic">Learn More</em>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
