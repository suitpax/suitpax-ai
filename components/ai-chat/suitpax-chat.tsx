"use client"

import { useState } from "react"
import { ExternalLink, Menu, ArrowLeft } from "lucide-react"
import type { FormValues } from "@/lib/form-schema"
import ChatForm from "./chat-form"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import ChatMessage from "./chat-message"
import MobileNavigation from "./mobile-navigation"
import Link from "next/link"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export type AISection = "business" | "expenses" | "tasks" | "reporting" | "support"

const businessTravelResponses = [
  "I can help you find the best business class flights to London. Based on your company's travel policy, I recommend British Airways departing at 10:30 AM or Lufthansa at 2:15 PM. Both include lounge access and comply with your expense guidelines. Would you like me to check availability?",
  "For your San Francisco trip, I've found excellent hotel options: The Marriott Marquis (downtown, $280/night) and Hilton Union Square ($320/night). Both offer executive lounges and are within your approved budget. Shall I reserve a room with late checkout?",
  "I notice you're traveling to Tokyo next month. I can arrange your entire itinerary including flights, accommodation, ground transportation, and even restaurant reservations. Would you like me to start with flight options or hotel preferences?",
  "Based on your travel history, I recommend booking your New York trip 2 weeks in advance for optimal pricing. I can set up price alerts and notify you when rates drop below $400 for business class flights.",
]

const expenseResponses = [
  "I've automatically categorized your recent travel expenses: Flights ($2,340), Hotels ($1,890), Meals ($456), and Transportation ($234). All receipts have been digitally captured and are ready for approval. Your total is within the monthly budget of $6,000.",
  "I notice you have 3 pending expense reports from your last business trips. I can auto-populate them using your digital receipts and submit for approval. This will save you approximately 45 minutes of manual work.",
  "Your travel expenses for Q1 show a 15% savings compared to last quarter, primarily due to booking flights 14 days in advance. I recommend maintaining this booking pattern for continued savings.",
  "I've detected a duplicate charge of $89 for your hotel in Berlin. I can dispute this automatically with your corporate card provider and track the refund process.",
]

const taskResponses = [
  "I've created a comprehensive task list for your upcoming London trip: 1) Confirm meeting with client at 2 PM, 2) Book restaurant for team dinner, 3) Arrange airport transfer, 4) Download offline maps. Would you like me to set reminders for each task?",
  "Your travel checklist is 80% complete. Remaining items: Pack presentation materials, confirm hotel check-in time, and set up international roaming. I can help you tackle these one by one.",
  "I've synchronized your travel itinerary with your calendar and added buffer time for airport transfers. Your meetings are optimally scheduled with 30-minute breaks between appointments.",
  "Based on your travel pattern, I suggest preparing these documents: passport copy, travel insurance, emergency contacts, and company authorization letter. I can help you organize these digitally.",
]

const reportingResponses = [
  "Your travel analytics for Q1 show: 12 business trips, average cost per trip $1,850, 89% on-time performance, and 15% savings vs. budget. Your most cost-effective route was London (saved $340 per trip). Would you like a detailed breakdown?",
  "I've generated your monthly travel report: Total spend $5,670 (within budget), 4 trips completed, average trip duration 3.2 days. Your carbon footprint was reduced by 23% through optimized routing.",
  "Comparing your travel patterns: You save an average of $280 per trip when booking 14+ days in advance. I recommend implementing this as a standard practice for non-urgent travel.",
  "Your team's travel efficiency has improved by 32% this quarter. Key factors: better advance planning, optimized routes, and preferred vendor usage. I can share best practices with other departments.",
]

const supportResponses = [
  "I'm here to help resolve any travel issues. Whether it's flight delays, hotel problems, expense questions, or policy clarifications, I can assist you 24/7. What specific challenge are you facing?",
  "For urgent travel assistance, I can connect you directly with our 24/7 support team. They can handle flight changes, emergency bookings, and travel disruptions in real-time.",
  "I notice your flight to Frankfurt was delayed by 3 hours. I've automatically rebooked your connecting flight and notified your hotel about the late arrival. Your meeting tomorrow remains confirmed.",
  "If you need to modify your travel policy or add new team members, I can guide you through the process step-by-step. What changes would you like to make?",
]

export default function SuitpaxChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Zia, your intelligent business travel assistant. I can help you plan trips, manage expenses, organize tasks, generate reports, and provide support. What would you like to accomplish today?",
      timestamp: new Date(),
    },
  ])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<AISection>("business")
  const isMobile = useMediaQuery("(max-width: 768px)")

  async function handleSubmit(values: FormValues) {
    if (!values.prompt) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: values.prompt,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Get responses based on active section
    const responses = getResponsesBySection(activeSection)

    // Simulate AI response with realistic delay
    setTimeout(
      () => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      },
      1500 + Math.random() * 1000,
    ) // 1.5-2.5 seconds for realism
  }

  const getResponsesBySection = (section: AISection): string[] => {
    switch (section) {
      case "business":
        return businessTravelResponses
      case "expenses":
        return expenseResponses
      case "tasks":
        return taskResponses
      case "reporting":
        return reportingResponses
      case "support":
        return supportResponses
      default:
        return businessTravelResponses
    }
  }

  const handleSectionChange = (section: AISection) => {
    setActiveSection(section)
    setMobileMenuOpen(false)

    // Add a welcome message for the new section
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

  const ExternalLinks = () => (
    <div className="flex items-center space-x-6">
      <Link href="/" className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal">
        <span className="mr-1 text-[10px] font-light">Home</span>
        <ExternalLink className="h-2.5 w-2.5" />
      </Link>
      <Link
        href="/pricing"
        className="flex items-center text-white hover:text-gray-300 transition-colors tracking-normal"
      >
        <span className="mr-1 text-[10px] font-light">Pricing</span>
        <ExternalLink className="h-2.5 w-2.5" />
      </Link>
    </div>
  )

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
                <Menu className="h-4 w-4" />
              </button>
            )}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4 text-white/70" />
              <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax" width={120} height={30} className="h-6 w-auto" />
            </Link>
            <h1 className="text-sm text-white font-light tracking-wide hidden sm:block">
              AI-Powered Business Travel Assistant
            </h1>
          </div>

          {/* Links in top right - desktop only */}
          {!isMobile && (
            <div className="pointer-events-auto">
              <ExternalLinks />
            </div>
          )}
        </div>

        {/* Section indicator - mobile only */}
        {isMobile && (
          <div className="px-3 py-2 bg-black/30 border-b border-white/5">
            <p className="text-[10px] font-light text-white/70">
              <span className="text-white font-medium">Zia</span> • {getSectionDisplayName(activeSection)}
            </p>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-white/20">
                <Image
                  src="/agents/agent-15.png"
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
        </div>

        {/* Input field at bottom */}
        <div className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <ChatForm isLoading={isLoading} onSubmit={handleSubmit} />
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

function getSectionDisplayName(section: AISection): string {
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
