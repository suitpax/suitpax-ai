"use client"
import { motion, AnimatePresence } from "framer-motion"
import { SparklesIcon, UserIcon, Cog6ToothIcon, PaperAirplaneIcon, MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PromptInput, PromptInputTextarea, PromptInputActions, PromptInputAction } from '@/components/ui/prompt-input'
import { useState, useEffect, useRef } from "react"
// ... otros imports

export default function SuitpaxChatPage() {
  // estados y lógica...

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <motion.header className="bg-gradient-to-r from-grat-200 to-white p-6 rounded-b-2xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-blue-600 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-serif italic text-white">Suitpax AI</h1>
              <p className="text-sm text-purple-100">Your intelligent travel assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-white/30 text-white border-white/50">
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
              Online
            </Badge>
            <Button variant="outline" size="sm" className="border-white text-white">
              <Cog6ToothIcon className="h-4 w-4 mr-2" /> Settings
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden lg:block w-80 bg-white dark:bg-gray-800 p-6 border-r dark:border-gray-700">
          {/* Quick Prompts adaptados al estilo */}
        </aside>

        <section className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800 space-y-6">
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div key={msg.id} className={`flex ${msg.role==='user'?'justify-end':'justify-start'}`}>
                  <div className="flex items-start space-x-3 max-w-2xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role==='assistant'?'bg-gradient-to-r from-blue-600 to-purple-600':'bg-gray-700'}`}>
                      {msg.role === 'assistant'
                        ? <SparklesIcon className="h-5 w-5 text-white" />
                        : <UserIcon className="h-5 w-5 text-white" />}
                    </div>
                    <div className={`rounded-2xl px-6 py-4 ${msg.role==='assistant'?'bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-sm':'bg-gray-900 text-white'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs mt-3 text-gray-500 dark:text-gray-400">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && /* indicador de carga adaptado */}
          </div>

          <div className="bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
            <PromptInput>
              <PromptInputTextarea
                ref={inputRef}
                value={input}
                onChange={...}
                placeholder="Ask me anything about your travel..."
                disabled={isLoading}
                className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <PromptInputActions>
                {browserSupportsSpeechRecognition && (
                  <PromptInputAction tooltip={isListening ? "Stop recording" : "Use voice input"}>
                    <Button variant="ghost" size="sm" onClick={toggleVoiceInput} className={isListening ? "text-red-600" : "text-gray-400"}>
                      {isListening ? <StopIcon /> : <MicrophoneIcon />}
                    </Button>
                  </PromptInputAction>
                )}
                <PromptInputAction tooltip="Send">
                  <Button type="submit" disabled={!input.trim() || isLoading}>
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              Suitpax AI can make mistakes. Please verify important travel information.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}