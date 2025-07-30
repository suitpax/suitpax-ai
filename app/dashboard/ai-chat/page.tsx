"use client"

import { useState } from "react"
import SuitpaxChat from "@/components/ai-chat/suitpax-chat"
import { motion } from "framer-motion"
import { Bot, MessageCircle, Zap, Globe, Clock, Shield } from "lucide-react"

export default function AIChatPage() {
  const [isChatOpen, setIsChatOpen] = useState(true)

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Assistant",
      description: "Zia understands your travel needs and provides intelligent recommendations",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Communicate in English or Spanish - Zia adapts to your language automatically",
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get immediate answers to your business travel questions 24/7",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Stay informed about flight changes, delays, and travel alerts",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are encrypted and protected with enterprise-grade security",
    },
    {
      icon: MessageCircle,
      title: "Natural Conversation",
      description: "Chat naturally - no need to learn specific commands or syntax",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-6">
            <em className="font-serif italic">AI Chat Assistant</em>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-6">
            <em className="font-serif italic">Meet Zia, Your</em>
            <br />
            <span className="text-gray-700">AI Travel Assistant</span>
          </h1>
          <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
            Get instant help with your business travel needs. Zia is available 24/7 to assist with bookings,
            recommendations, and travel management.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-medium tracking-tighter mb-6">
                <em className="font-serif italic">Why Choose Zia?</em>
              </h2>
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-medium tracking-tighter mb-2">{feature.title}</h3>
                        <p className="text-sm font-light text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-medium tracking-tighter mb-4">
                <em className="font-serif italic">Quick Start Guide</em>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    1
                  </div>
                  <p className="font-light text-gray-600">
                    <strong className="font-medium">Start a conversation:</strong> Click the chat button or type your
                    question
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    2
                  </div>
                  <p className="font-light text-gray-600">
                    <strong className="font-medium">Ask naturally:</strong> Use everyday language - no special commands
                    needed
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    3
                  </div>
                  <p className="font-light text-gray-600">
                    <strong className="font-medium">Get instant help:</strong> Receive personalized recommendations and
                    assistance
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:sticky lg:top-8"
          >
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium tracking-tighter">
                  <em className="font-serif italic">Chat with Zia</em>
                </h3>
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {isChatOpen ? "Minimize" : "Open Chat"}
                </button>
              </div>

              <div className="relative">
                <SuitpaxChat
                  isOpen={isChatOpen}
                  onToggle={() => setIsChatOpen(!isChatOpen)}
                  className="relative bottom-0 right-0 w-full h-[500px] shadow-none border-0"
                />
              </div>
            </div>

            {/* Sample Questions */}
            <div className="mt-6 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h4 className="font-medium tracking-tighter mb-4">
                <em className="font-serif italic">Try These Questions</em>
              </h4>
              <div className="space-y-2">
                {[
                  "Find me flights from NYC to London next week",
                  "What's the best hotel near the convention center?",
                  "Help me with expense reporting",
                  "Show me travel policy guidelines",
                  "¿Puedes ayudarme con mi viaje de negocios?",
                ].map((question, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200 font-light text-gray-600"
                    onClick={() => {
                      // This would send the question to the chat
                      console.log("Sample question clicked:", question)
                    }}
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
