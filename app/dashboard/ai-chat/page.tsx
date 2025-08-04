"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUp, Paperclip, X, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  ReasoningResponse,
} from "@/components/prompt-kit/reasoning"

// ... interfaces y componentes auxiliares permanecen igual ...

export default function AIChatPage() {
  // ... todos los estados y lógica permanecen igual ...

  return (
    <div className="h-full flex flex-col bg-gray-50"> {/* Cambio principal aquí */}
      {/* Header - Altura fija responsive */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/50 backdrop-blur-sm border-b border-gray-200 flex-shrink-0"
        style={{ height: 'auto', minHeight: '4rem' }}
      >
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                <Image
                  src="/agents/agent-2.png"
                  alt="Suitpax AI"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tighter truncate">
                  <em className="font-serif italic">Suitpax AI</em>
                </h1>
                <p className="text-xs md:text-sm text-gray-600 font-light hidden sm:block">
                  Try the superpowers
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Toggle para razonamiento */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <label className="text-xs text-gray-600 hidden sm:inline">AI Reasoning</label>
                <button
                  onClick={() => setShowReasoning(!showReasoning)}
                  className={`relative inline-flex h-4 w-7 sm:h-5 sm:w-9 items-center rounded-full transition-colors ${
                    showReasoning ? 'bg-emerald-400' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform ${
                      showReasoning ? 'translate-x-3.5 sm:translate-x-5' : 'translate-x-0.5 sm:translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <span className="inline-flex items-center rounded-xl bg-emerald-950/10 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-emerald-950">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-950 animate-pulse mr-1"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat Container - Altura dinámica */}
      <div className="flex-1 min-h-0 relative"> {/* Añadido relative */}
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
            {/* ... todo el contenido del chat permanece igual ... */}
          </ChatContainerContent>
          
          {/* Scroll Anchor para auto-scroll */}
          <ChatContainerScrollAnchor />
          
          {/* Scroll Button flotante */}
          <ScrollButton className="bottom-20 sm:bottom-24 right-4 sm:right-6" />
        </ChatContainerRoot>
      </div>

      {/* Input con PromptInput - Altura fija responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/50 backdrop-blur-sm border-t border-gray-200 flex-shrink-0"
        style={{ minHeight: '4rem' }}
      >
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <PromptInput
              value={input}
              onValueChange={setInput}
              isLoading={loading}
              onSubmit={handleSend}
              className="w-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* ... todo el contenido del input permanece igual ... */}
            </PromptInput>
          </div>
        </div>
      </motion.div>
    </div>
  )
}