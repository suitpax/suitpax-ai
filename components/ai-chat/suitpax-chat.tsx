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
            className="fixed left-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-md border-r border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <img src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" className="h-6 w-auto" />
                <span className="text-white font-medium">
                  <em className="font-serif italic">AI Assistant</em>
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id

                  return (
                    <button
                      key={section.id}
                      onClick={() => onSectionChange(section.id)}
                      className={`w-full text-left p-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-white/10 text-white border border-white/20"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs text-white/50">
                            <em className="font-serif italic">{section.description}</em>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="text-xs text-white/50 text-center">
                <em className="font-serif italic">Powered by Suitpax AI</em>
              </div>
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
        "Hello! I'm Zia, your intelligent business travel assistant. I can help you plan trips, manage expenses, find the best deals, and handle all your corporate travel needs. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<AISection>("business")
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

  return (
    <div className="relative h-[100dvh] w-full bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <button onClick={() => setMobileMenuOpen(true)} className="text-white p-1 rounded-md hover:bg-white/10">
                <Bars3Icon className="h-4 w-4" />
              </button>
            )}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeftIcon className="h-4 w-4 text-white/70" />
              <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={120} height={30} className="h-6 w-auto" />
            </Link>
            <h1 className="text-sm text-white font-light tracking-wide hidden sm:block">
              <em className="font-serif italic">AI-Powered Business Travel Assistant</em>
            </h1>
          </div>

          {!isMobile && (
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
              >
                <span className="mr-1 text-[10px] font-light">
                  <em className="font-serif italic">Home</em>
                </span>
                <ArrowTopRightOnSquareIcon className="h-2.5 w-2.5" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
              >
                <span className="mr-1 text-[10px] font-light">
                  <em className="font-serif italic">Pricing</em>
                </span>
                <ArrowTopRightOnSquareIcon className="h-2.5 w-2.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Section indicator - mobile only */}
        {isMobile && (
          <div className="px-3 py-2 bg-black/30 border-b border-white/5">
            <p className="text-[10px] font-light text-white/70">
              <span className="text-white font-medium">
                <em className="font-serif italic">Zia</em>
              </span>{" "}
              • <em className="font-serif italic">{getSectionDisplayName(activeSection)}</em>
            </p>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-white/20">
                {message.role === "assistant" ? (
                  <Image
                    src="/agents/agent-aria.jpeg"
                    alt="Zia AI Assistant"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">U</span>
                  </div>
                )}
              </div>
              <div
                className={`p-3 rounded-xl max-w-[70%] backdrop-blur-sm ${
                  message.role === "user"
                    ? "bg-white/20 border border-white/20 text-white"
                    : "bg-black/80 border border-white/10 text-white"
                }`}
              >
                <p className="text-sm font-light leading-relaxed">
                  {message.content}
                  {message.isTyping && <span className="inline-block w-2 h-4 bg-white/60 ml-1 animate-pulse"></span>}
                </p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-white/20">
                <Image
                  src="/agents/agent-aria.jpeg"
                  alt="Zia AI Assistant"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-cover"
                />
              </div>
              <div className="bg-black/80 border border-white/10 p-3 rounded-xl max-w-[70%] backdrop-blur-sm">
                <div className="flex space-x-1.5">
                  <div className="h-2 w-2 bg-white/60 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-white/60 rounded-full animate-pulse delay-100"></div>
                  <div className="h-2 w-2 bg-white/60 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input field at bottom */}
        <div className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about flights, hotels, expenses, or any travel needs..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm font-light"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed rounded-xl border border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              <PaperAirplaneIcon className="h-4 w-4 text-white" />
            </button>
          </form>
        </div>
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
