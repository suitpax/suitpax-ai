"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Check, Shield } from "lucide-react"
import ModernChatInput from "../ui/chat-input"

export default function IntelligentPolicyShowcase() {
  const [activeTab, setActiveTab] = useState("compliance")

  return (
    <section className="relative overflow-hidden py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header con estilo similar a Business Travel Revolution */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3 justify-center">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              Travel Policy
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Coming Q2 2025
            </span>
          </div>

          <motion.h2
            className="text-2xl md:text-2xl lg:text-2xl font-medium tracking-tighter text-black leading-none max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Intelligent travel policies powered by AI
          </motion.h2>

          <motion.div
            className="mt-6 mb-4 inline-flex items-center bg-black text-white px-6 py-2 rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-lg font-semibold tracking-tighter mr-2">LAUNCHING Q2 2025</span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </motion.div>

          <motion.p
            className="mt-3 text-sm font-medium text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create, manage and enforce travel policies with our AI-powered platform
          </motion.p>
        </div>

        {/* Contenido principal con ZiaChatInput */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 mb-4">
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              AI POLICY GENERATOR
            </div>
            <h3 className="text-3xl font-medium tracking-tighter text-gray-900 mb-4">
              Generate custom travel policies in seconds
            </h3>
            <p className="text-gray-600 mb-6">
              Tell our AI what you need, and get a fully customized travel policy that fits your company's requirements.
            </p>

            <ul className="space-y-3">
              {[
                "Tailored to your company size and budget",
                "Automatic compliance with regulations",
                "Easy to understand language",
                "Exportable to multiple formats",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="mr-2 mt-1 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <ModernChatInput />
            </div>
          </div>
        </div>

        {/* Sección de clientes simplificada */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-8">Trusted by companies of all sizes</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
            <Image
              src="/logos/mcp-logo-1.png"
              alt="Client Logo"
              width={120}
              height={40}
              className="mx-auto h-8 w-auto object-contain"
            />
            <Image
              src="/logos/mcp-logo-2.png"
              alt="Client Logo"
              width={120}
              height={40}
              className="mx-auto h-8 w-auto object-contain"
            />
            <Image
              src="/logos/hilton-logo.png"
              alt="Client Logo"
              width={120}
              height={40}
              className="mx-auto h-8 w-auto object-contain"
            />
            <Image
              src="/logo/eurazeo-logo.png"
              alt="Client Logo"
              width={120}
              height={40}
              className="mx-auto h-8 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
