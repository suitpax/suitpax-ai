"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Shield } from "lucide-react"
import { ZiaChatInput } from "../ui/zia-chat-input"

export default function IntelligentPolicyShowcase() {
  const [activeTab, setActiveTab] = useState("compliance")

  return (
    <section className="relative overflow-hidden py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header con estilo similar a Business Travel Revolution */}
        <div className="max-w-4xl mx-auto text-center mb-12">
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

          <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm overflow-hidden p-6">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Suitpax AI</h4>
              <p className="text-sm text-gray-500">
                Describe your needs and our AI will generate a custom travel policy for you
              </p>
            </div>

            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-top"
                style={{ transform: "scale(1.2)" }}
              >
                <source src="/videos/supermotion_co.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Componente de chat input */}
            <ZiaChatInput />

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Example policies you can generate:</p>
              <div className="flex flex-wrap gap-2">
                {["Startup policy", "Enterprise policy", "Budget-focused", "Sustainability-focused"].map(
                  (policy, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      {policy}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
