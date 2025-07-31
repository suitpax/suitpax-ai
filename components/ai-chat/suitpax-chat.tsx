"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  ArrowTopRightOnSquareIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon,
  BriefcaseIcon,
  CreditCardIcon,
  CheckSquareIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  MicrophoneIcon,
  StopIcon,
} from "@heroicons/react/24/outline"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

export type AISection = "business" | "expenses" | "tasks" | "reporting" | "support"

const sections = [
  { id: "business" as AISection, name: "Business Travel", icon: BriefcaseIcon, description: "Plan and book trips" },
  {
    id: "expenses" as AISection,
    name: "Expense Management",
    icon: CreditCardIcon,
    description: "Track and manage costs",
  },
  { id: "tasks" as AISection, name: "Task Management", icon: CheckSquareIcon, description: "Organize your workflow" },
  { id: "reporting" as AISection, name: "Analytics", icon: ChartBarIcon, description: "Insights and reports" },
  { id: "support" as AISection, name: "Support", icon: QuestionMarkCircleIcon, description: "Get help and assistance" },
]

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
  activeSection: AISection
  onSectionChange: (section: AISection) => void
}

function MobileNavigation({ isOpen, onClose, activeSection, onSectionChange }: MobileNavigationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={28} className="h-7 w-auto" />
                <span className="text-black font-medium text-sm">AI Assistant</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id

                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        onSectionChange(section.id)
                        onClose()
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-colors ${
                        isActive ? "bg-black text-white" : "text-gray-700 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className={`text-xs ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                            {section.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">Suitpax AI • Powered by Claude</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function SuitpaxChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your Suitpax AI assistant. I can help you plan business trips, manage expenses, find the best deals, and handle all your corporate travel needs. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<AISection>("business")
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const typeMessage = (messageId: string, content: string) => {
    let index = 0
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: content.slice(0, index + 1), isTyping: index < content.length - 1 }
            : msg,
        ),
      )
      index++
      if (index >= content.length) {
        clearInterval(interval)
      }
    }, 30)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10),
          section: activeSection,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, aiMessage])

      setTimeout(() => {
        typeMessage(aiMessageId, data.response)
      }, 500)
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our support team if the issue persists.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSectionChange = (section: AISection) => {
    setActiveSection(section)
    setMobileMenuOpen(false)

    const welcomeMessages: Record<AISection, string> = {
      business:
        "I'm ready to help optimize your business travel arrangements. Whether you need flights, hotels, or complete itinerary planning, I can find the best options that comply with your company policies. What trip are you planning?",
      expenses:
        "Let me help you streamline your expense management. I can categorize receipts, track spending against budgets, identify savings opportunities, and prepare reports for approval. What expenses would you like me to review?",
      tasks:
        "I'll help you stay organized with all your travel-related tasks. From pre-trip preparation to post-trip follow-ups, I can create checklists, set reminders, and ensure nothing falls through the cracks. What do you need to accomplish?",
      reporting:
        "I can generate comprehensive analytics on your travel patterns, spending, and efficiency metrics. Whether you need monthly reports, budget analysis, or performance insights, I'll provide actionable data. What metrics interest you most?",
      support:
        "I'm here to provide assistance with any travel challenges or questions. From policy clarifications to emergency support, I can help resolve issues quickly and efficiently. How can I assist you today?",
    }

    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: welcomeMessages[section],
        timestamp: new Date(),
      },
    ])
  }

  const getSectionDisplayName = (section: AISection): string => {
    switch (section) {
      case "business":
        return "Business Travel"
      case "expenses":
        return "Expense Management"
      case "tasks":
        return "Task Management"
      case "reporting":
        return "Analytics & Reporting"
      case "support":
        return "Support & Assistance"
      default:
        return "AI Assistant"
    }
  }

  const startVoiceRecording = () => {
    setIsListening(true)
    // Voice recording logic would go here
    setTimeout(() => setIsListening(false), 3000) // Mock stop after 3 seconds
  }

  return (
    <div className="relative h-[100dvh] w-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-200/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent_100%)]"></div>
      </div>

      {/* Main UI */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-600 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            )}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <ArrowLeftIcon className="h-4 w-4 text-gray-500" />
              <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={120} height={28} className="h-7 w-auto" />
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-lg font-medium tracking-tight text-black">Suitpax AI</h1>
              <p className="text-xs text-gray-500">Intelligent Business Travel Assistant</p>
            </div>
          </div>

          {!isMobile && (
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center text-gray-600 hover:text-black transition-colors text-sm">
                <span className="mr-1">Home</span>
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center text-gray-600 hover:text-black transition-colors text-sm"
              >
                <span className="mr-1">Pricing</span>
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-80 bg-white/50 backdrop-blur-sm border-r border-gray-200/50 flex flex-col">
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-sm font-medium text-gray-900 mb-4">AI Sections</h2>
                <div className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id

                    return (
                      <button
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`w-full text-left p-3 rounded-xl transition-colors ${
                          isActive ? "bg-black text-white" : "text-gray-700 hover:text-black hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">{section.name}</div>
                            <div className={`text-xs ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                              {section.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1 p-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Current Section</h3>
                  <p className="text-xs text-gray-600">{getSectionDisplayName(activeSection)}</p>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start space-x-4 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                      {message.role === "assistant" ? (
                        <Image
                          src="/agents/agent-aria.jpeg"
                          alt="Suitpax AI"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">U</span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-2xl max-w-2xl ${
                        message.role === "user"
                          ? "bg-black text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                        {message.isTyping && (
                          <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                        )}
                      </p>
                      <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Image
                        src="/agents/agent-aria.jpeg"
                        alt="Suitpax AI"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl max-w-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
                <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me about flights, hotels, expenses, or any travel needs..."
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className={`p-3 rounded-xl border transition-all duration-200 ${
                      isListening
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white hover:bg-gray-50 text-gray-600 border-gray-300"
                    }`}
                  >
                    {isListening ? <StopIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="p-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all duration-200"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 text-white" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Chat Area */}
        {isMobile && (
          <>
            {/* Section indicator */}
            <div className="px-4 py-2 bg-white/50 border-b border-gray-200/50">
              <p className="text-xs text-gray-600">
                <span className="font-medium text-black">Suitpax AI</span> • {getSectionDisplayName(activeSection)}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start space-x-3 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    {message.role === "assistant" ? (
                      <Image
                        src="/agents/agent-aria.jpeg"
                        alt="Suitpax AI"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">U</span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl max-w-[75%] ${
                      message.role === "user" ? "bg-black text-white" : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {message.content}
                      {message.isTyping && (
                        <span className="inline-block w-1 h-3 bg-gray-400 ml-1 animate-pulse"></span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Image
                      src="/agents/agent-aria.jpeg"
                      alt="Suitpax AI"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Input */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
              <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about travel..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    isListening
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white hover:bg-gray-50 text-gray-600 border-gray-300"
                  }`}
                >
                  {isListening ? <StopIcon className="h-4 w-4" /> : <MicrophoneIcon className="h-4 w-4" />}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all duration-200"
                >
                  <PaperAirplaneIcon className="h-4 w-4 text-white" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
    </div>
  )
}
