"use client"

import { useRef } from "react"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
  PiLightningBold,
  PiBrainBold,
  PiChatCircleTextBold,
  PiGlobeBold,
  PiClockClockwiseBold,
  PiSuitcaseBold,
  PiReceiptBold,
  PiCalendarCheckBold,
} from "react-icons/pi"
import {
  SiGmail,
  SiGooglecalendar,
  SiSlack,
  SiNotion,
  SiExpensify,
  SiZoom,
  SiAsana,
  SiIntercom,
  SiBrave,
  SiStripe,
  SiQuickbooks,
} from "react-icons/si"
import { TbBrandBooking } from "react-icons/tb"
import { FaMoneyCheckAlt } from "react-icons/fa"

// Estilos para el efecto typing
const typingStyles = `
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }
  
  .typing-effect {
    display: inline-block;
    overflow: hidden;
    border-right: .15em solid transparent;
    white-space: nowrap;
    animation: typing 3s steps(40, end) forwards;
  }
`

// Actualizar los agentes con capacidades MCP para simplificarlos y enfocarlos en task, business travel y expense management
const mcpAgents = [
  {
    id: 1,
    name: "Luna",
    avatar: "/agents/agent-50.png",
    role: "Task Management",
    description: "Organizes and prioritizes your daily tasks across multiple platforms.",
    icon: <PiCalendarCheckBold className="w-3 h-3" />,
  },
  {
    id: 2,
    name: "Kahn",
    avatar: "/agents/kahn-avatar.png",
    role: "Business Travel",
    description: "Plans and optimizes your business trips with complete context awareness.",
    icon: <PiSuitcaseBold className="w-3 h-3" />,
  },
  {
    id: 3,
    name: "Winter",
    avatar: "/agents/agent-52.png",
    role: "Expense Management",
    description: "Tracks, categorizes and reports all your business expenses automatically.",
    icon: <PiReceiptBold className="w-3 h-3" />,
  },
]

// MCP capabilities
const mcpCapabilities = [
  {
    title: "Contextual Understanding",
    description:
      "Maintains conversation context across multiple sessions, remembering your preferences and past interactions",
    icon: <PiBrainBold className="w-6 h-6" />,
    detail: "MCP can maintain context for up to 6 months, unlike standard AI that forgets after each session",
  },
  {
    title: "Seamless Continuity",
    description:
      "Pick up exactly where you left off, even after days or weeks, with perfect recall of your travel plans",
    icon: <PiChatCircleTextBold className="w-6 h-6" />,
    detail: "Resume conversations from any device with 100% context preservation",
  },
  {
    title: "Multi-step Planning",
    description:
      "Handles complex, multi-stage travel itineraries while maintaining context throughout the entire process",
    icon: <PiLightningBold className="w-6 h-6" />,
    detail: "Coordinates up to 50 different travel elements in a single itinerary without losing track",
  },
  {
    title: "Global Awareness",
    description: "Understands geographic and cultural context for more intelligent travel recommendations",
    icon: <PiGlobeBold className="w-6 h-6" />,
    detail: "Trained on data from 195 countries and 3,000+ cities for truly global intelligence",
  },
  {
    title: "Temporal Intelligence",
    description: "Maintains awareness of time-sensitive requirements and schedules across your entire journey",
    icon: <PiClockClockwiseBold className="w-6 h-6" />,
    detail: "Automatically adjusts for time zones, seasonal changes, and booking deadlines",
  },
]

// Workflow integrations
const workflowIntegrations = [
  {
    name: "Intercom",
    icon: <SiIntercom className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Manages client communications",
  },
  {
    name: "Gmail",
    icon: <SiGmail className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Automatically extracts travel details from emails",
  },
  {
    name: "Calendar",
    icon: <SiGooglecalendar className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Syncs travel plans with your calendar",
  },
  {
    name: "Zoom",
    icon: <SiZoom className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Schedules meetings around your travel",
  },
  {
    name: "Notion",
    icon: <SiNotion className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Creates detailed travel wikis and itineraries",
  },
  {
    name: "Asana",
    icon: <SiAsana className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Coordinates team travel projects",
  },
  {
    name: "Slack",
    icon: <SiSlack className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Shares travel updates with your team",
  },
  {
    name: "Expensify",
    icon: <SiExpensify className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Automates expense reporting",
  },
  {
    name: "Brave",
    icon: <SiBrave className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Secure browsing for travel research",
  },
  {
    name: "Brex",
    icon: <FaMoneyCheckAlt className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Corporate cards and expense management",
  },
  {
    name: "Stripe",
    icon: <SiStripe className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Process payments for travel bookings",
  },
  {
    name: "QuickBooks",
    icon: <SiQuickbooks className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Accounting integration for travel expenses",
  },
  {
    name: "Booking",
    icon: <TbBrandBooking className="w-4 h-4" />,
    color: "bg-black/10 text-black",
    description: "Direct integration with hotel booking platform",
  },
]

// Advanced integrations - Ahora vacío ya que solo usamos las integraciones principales
const advancedIntegrations = []

// Workflow examples
const workflowExamples = [
  {
    title: "Pre-trip Planning",
    steps: ["Gmail", "Calendar", "Notion", "Brave"],
    description: "MCP maintains context across your entire planning process",
    detail:
      "Luna reads your emails, identifies travel needs, creates detailed itineraries in Notion, and helps with research using Brave - all while maintaining perfect context between steps.",
  },
  {
    title: "Team Travel Coordination",
    steps: ["Slack", "Notion", "Calendar", "Zoom"],
    description: "Seamlessly coordinate with your team while traveling",
    detail:
      "Kahn coordinates with your team via Slack, creates a shared Notion travel wiki, syncs everyone's calendars, and schedules Zoom meetings that respect time zones.",
  },
  {
    title: "Expense Management",
    steps: ["Expensify", "Gmail", "Slack", "Notion"],
    description: "Automatically organize receipts and track spending",
    detail:
      "Zara tracks your transactions, categorizes them in Expensify, forwards confirmation emails, and creates expense reports in Notion for your team.",
  },
  {
    title: "Client Meeting Trip",
    steps: ["Intercom", "Calendar", "Zoom", "Asana"],
    description: "Prepare for client meetings while traveling",
    detail:
      "Winter pulls client data from Intercom, schedules in your Calendar, sets up Zoom meetings, and tracks follow-ups in Asana.",
  },
  {
    title: "Remote Work Travel",
    steps: ["Brave", "Asana", "Slack", "Zoom"],
    description: "Stay productive while working from anywhere",
    detail:
      "Sophia helps research locations with Brave, keeps your Asana tasks updated, notifies your team on Slack, and ensures your Zoom meetings are scheduled in your local time zone.",
  },
  {
    title: "Corporate Finance Travel",
    steps: ["Brex", "QuickBooks", "Booking", "Stripe"],
    description: "Manage business travel with financial integrations",
    detail:
      "Luna connects with your Brex account for corporate card transactions, syncs expenses to QuickBooks, books accommodations through Booking.com, and processes payments via Stripe - all while maintaining complete financial context.",
  },
]

// Mejorar los ejemplos de chat para que tengan más sentido y muestren mejor la diferencia
const standardChatExample = [
  {
    role: "user",
    avatar: "/community/brianna-ware.webp",
    content: "I need to plan a business trip to Tokyo next month for a conference and meet with our Japanese partners.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-53.png",
    name: "Sophia",
    content: "I can help with that. When exactly are you planning to travel and how long will you stay?",
  },
  {
    role: "user",
    avatar: "/community/brianna-ware.webp",
    content: "May 15-18 for the conference, and I'd like to stay a couple more days for meetings.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-53.png",
    name: "Sophia",
    content:
      "Great, I'll look into flights and accommodations for May 15-20. Do you have any hotel preferences or a budget in mind?",
  },
  {
    role: "system",
    content: "3 days later...",
  },
  {
    role: "user",
    avatar: "/community/brianna-ware.webp",
    content: "I need to find a hotel near the Tokyo International Forum that has good reviews from business travelers.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-53.png",
    name: "Sophia",
    content:
      "I'd be happy to help you find a hotel near the Tokyo International Forum. When will you be traveling and what's your budget range for accommodations?",
  },
  {
    role: "user",
    avatar: "/community/brianna-ware.webp",
    content: "I already told you, May 15-20. My budget is around $300 per night.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-53.png",
    name: "Sophia",
    content:
      "I apologize for asking again. Let me search for hotels near the Tokyo International Forum within your $300 per night budget for May 15-20.",
  },
]

const mcpChatExample = [
  {
    role: "user",
    avatar: "/community/jordan-burgess.webp",
    content: "I need to plan a business trip to Tokyo next month for a conference and meet with our Japanese partners.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-50.png",
    name: "Luna",
    content: "I can help with that. When exactly are you planning to travel and how long will you stay?",
  },
  {
    role: "user",
    avatar: "/community/jordan-burgess.webp",
    content: "May 15-18 for the conference, and I'd like to stay a couple more days for meetings.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-50.png",
    name: "Luna",
    content:
      "Great, I'll look into flights and accommodations for May 15-20. Do you have any hotel preferences or a budget in mind?",
  },
  {
    role: "user",
    avatar: "/community/jordan-burgess.webp",
    content: "I prefer 4-5 star hotels with good business facilities. Budget around $300 per night.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-50.png",
    name: "Luna",
    content:
      "I've found several options within your budget. The Tokyu Stay Ginza and Mitsui Garden Hotel Ginza Premier both have excellent business facilities and are within your price range. Would you like me to book one of these?",
  },
  {
    role: "system",
    content: "3 days later...",
  },
  {
    role: "user",
    avatar: "/community/jordan-burgess.webp",
    content: "I need to find a hotel near the Tokyo International Forum that has good reviews from business travelers.",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-50.png",
    name: "Luna",
    content:
      "For your upcoming Tokyo trip (May 15-20), I've found several hotels near the Tokyo International Forum with excellent business traveler reviews. The Tokyu Stay Ginza and Mitsui Garden Hotel Ginza Premier both offer business amenities within your $300/night budget. Based on your preference for quiet rooms from your past stays, I've filtered for options with noise-reducing features. Would you like me to book the Mitsui Garden Hotel?",
  },
  {
    role: "user",
    avatar: "/community/jordan-burgess.webp",
    content: "Yes, please book that one. Also, can you recommend some restaurants near the hotel for client dinners?",
  },
  {
    role: "assistant",
    avatar: "/agents/agent-50.png",
    name: "Luna",
    content:
      "I've booked your stay at Mitsui Garden Hotel Ginza Premier for May 15-20. For client dinners, based on your previous preference for upscale sushi and teppanyaki restaurants, I recommend Sushi Ginza Onodera (Michelin-starred) and Ukai-tei Ginza, both within walking distance. Would you like me to make reservations for any specific dates during your stay?",
  },
]

// Cambiar los títulos alternativos a normal case y añadir 2 más
const alternativeTitles = [
  "Model context protocol for AI Agents",
  "Persistent memory for AI Agents",
  "Continuous context for AI Agents",
  "Long-term memory for AI Agents",
  "Intelligent memory retention for AI Agents", // Nuevo título
  "Enhanced context awareness for AI Agents", // Nuevo título
]

// Añadir más subtítulos que se vayan actualizando
const mcpSubtitles = [
  "Model context protocol enables AI agents to maintain complete context between conversations, remembering preferences, history, and specific details for months, not just seconds.",
  "Our AI agents remember your preferences and past interactions, providing a truly personalized travel experience across all your business trips.",
  "With MCP technology, your travel context is preserved across multiple sessions, eliminating repetitive explanations and streamlining your booking process.",
  "Experience AI that truly understands your travel patterns and preferences, connecting with 400+ airlines and premium hotels worldwide.",
  "Suitpax MCP technology creates a continuous thread of understanding through all your travel planning, from initial research to expense reporting.",
]

// MCP vs Standard AI comparison
const comparisonPoints = [
  {
    title: "Context Retention",
    standard: "Forgets context after each session, requiring repetition of information",
    mcp: "Maintains context for up to 6 months, remembering all previous interactions",
  },
  {
    title: "Multi-session Planning",
    standard: "Treats each conversation as new, losing travel preferences and history",
    mcp: "Seamlessly continues planning across days or weeks with perfect recall",
  },
  {
    title: "Integration Depth",
    standard: "Basic integrations with limited data sharing between services",
    mcp: "Deep integrations with full context preservation across all business tools",
  },
  {
    title: "Personalization",
    standard: "Generic recommendations based only on current conversation",
    mcp: "Highly personalized suggestions based on your entire travel history",
  },
  {
    title: "Workflow Complexity",
    standard: "Handles simple, linear tasks but struggles with multi-step processes",
    mcp: "Manages complex, non-linear workflows across multiple services seamlessly",
  },
]

// Modificar la función MCPAIAgents para incluir los nuevos subtítulos
export const MCPAIAgents = () => {
  const [activeWorkflow, setActiveWorkflow] = useState(0)
  const [activeCapability, setActiveCapability] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showIntegrationDetail, setShowIntegrationDetail] = useState(null)
  const [typingText, setTypingText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0)
  const integrationRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)

    // Auto-rotate through workflows
    const workflowInterval = setInterval(() => {
      setActiveWorkflow((prev) => (prev + 1) % workflowExamples.length)
    }, 7000)

    // Auto-rotate through titles
    const titleInterval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % alternativeTitles.length)
      setTypingText("")
      setIsTyping(true)
    }, 5000)

    // Auto-rotate through subtitles
    const subtitleInterval = setInterval(() => {
      setCurrentSubtitleIndex((prev) => (prev + 1) % mcpSubtitles.length)
    }, 6000)

    // Typing effect for the title
    const typingInterval = setInterval(() => {
      const currentTitle = alternativeTitles[currentTitleIndex]
      if (typingText.length < currentTitle.length && isTyping) {
        setTypingText(currentTitle.substring(0, typingText.length + 1))
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 100)

    return () => {
      clearInterval(workflowInterval)
      clearInterval(titleInterval)
      clearInterval(subtitleInterval)
      clearInterval(typingInterval)
    }
  }, [currentTitleIndex, typingText, isTyping])

  // Modificar la parte del return donde se muestra el subtítulo
  return (
    <section className="py-8 bg-gray-200 overflow-hidden relative">
      {/* Coordenadas decorativas como en el diseño de Hiring */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          <div className="flex justify-between text-xs border-b border-black/20 pb-2 mb-8 w-[200%]">
            <span>37° 46' 30.0"</span>
            <span>N</span>
            <span>122° 25' 09.0"</span>
            <span>W</span>
            <span>37.7750</span>
            <span>↑</span>
            <span>-122.4194</span>
            <span>→</span>
            <span>San Francisco</span>
            <span>California</span>
            <span>37° 46' 30.0"</span>
            <span>N</span>
            <span>122° 25' 09.0"</span>
            <span>W</span>
            <span>37.7750</span>
            <span>↑</span>
            <span>-122.4194</span>
            <span>→</span>
            <span>San Francisco</span>
            <span>California</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-8">
        <div className="text-center mb-6">
          {/* MCP logo en el centro */}
          <div className="flex justify-center mb-3">
            <Image src="/logos/mcp-logo-1.png" alt="MCP Logo" width={40} height={40} className="rounded-lg" />
          </div>

          <div className="relative inline-block">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-black mb-3 leading-none">
              Model context protocol for AI Agents
            </h2>
          </div>

          <p className="text-black/80 max-w-2xl mx-auto text-sm md:text-base font-medium">
            {mcpSubtitles[currentSubtitleIndex]}
          </p>
        </div>

        {/* AI Agents - Versión más compacta estilo Hacker News */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {mcpAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white/50 backdrop-blur-sm p-2 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={agent.avatar || "/placeholder.svg"}
                      alt={agent.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-0.5">
                      <h4 className="text-xs font-medium">{agent.name}</h4>
                      <div className="inline-flex items-center rounded-full bg-black/5 px-1.5 py-0.5 text-[8px] font-medium text-black border border-black/10">
                        {agent.icon}
                        <span className="ml-0.5">{agent.role}</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-black/70">{agent.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison section - Más compacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          {/* Standard AI */}
          <div className="bg-transparent border border-black/20 rounded-xl shadow-sm p-3">
            <div className="inline-block border border-black/30 px-2 py-0.5 mb-2 text-[10px] text-black/80 rounded-xl bg-transparent font-medium w-full md:w-auto">
              STANDARD AI ASSISTANT
            </div>

            <div className="space-y-1 mb-3 h-[320px] overflow-hidden">
              {standardChatExample.slice(0, 4).map((message, idx) => {
                if (message.role === "system") {
                  return (
                    <div key={idx} className="text-[9px] text-black/60 italic text-center py-1">
                      <p>{message.content}</p>
                    </div>
                  )
                }

                if (message.role === "user") {
                  return (
                    <div
                      key={idx}
                      className="bg-transparent border border-black/20 rounded-xl p-1.5 text-[9px] flex items-start"
                    >
                      <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                        <Image
                          src={message.avatar || "/placeholder.svg"}
                          alt="User"
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-0.5">User:</p>
                        <p className="typing-effect">{message.content}</p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={idx}
                    className="bg-transparent border border-black/20 rounded-xl p-1.5 text-[9px] flex items-start"
                  >
                    <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                      <Image
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.name}
                        width={16}
                        height={16}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-0.5">{message.name}:</p>
                      <p className="typing-effect">{message.content}</p>
                    </div>
                  </div>
                )
              })}
              <div className="text-[9px] text-black/60 italic text-center">
                <p>3 days later...</p>
              </div>
              {standardChatExample.slice(5, 7).map((message, idx) => {
                if (message.role === "user") {
                  return (
                    <div
                      key={`later-${idx}`}
                      className="bg-transparent border border-black/20 rounded-xl p-1.5 text-[9px] flex items-start"
                    >
                      <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                        <Image
                          src={message.avatar || "/placeholder.svg"}
                          alt="User"
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-0.5">User:</p>
                        <p className="typing-effect">{message.content}</p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={`later-${idx}`}
                    className="bg-transparent border border-black/20 rounded-xl p-1.5 text-[9px] flex items-start"
                  >
                    <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                      <Image
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.name}
                        width={16}
                        height={16}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-0.5">{message.name}:</p>
                      <p className="typing-effect">{message.content}</p>
                    </div>
                  </div>
                )
              })}
              <div className="text-[9px] text-black/60 italic text-center mt-2">
                <p className="font-medium">Context lost between conversations</p>
                <p className="mt-1">Standard AI has no memory of previous interactions</p>
              </div>
            </div>
          </div>

          {/* MCP-enhanced AI */}
          <div className="bg-black text-white rounded-xl shadow-sm p-3 relative overflow-hidden">
            <div className="inline-flex items-center border border-white/30 px-2 py-0.5 mb-2 text-[10px] text-white/80 rounded-xl bg-transparent font-medium w-full md:w-auto">
              <Image
                src="/logo/suitpax-cloud-logo.webp"
                alt="Suitpax"
                width={50}
                height={12}
                className="h-2.5 w-auto mr-1"
              />
              AI AGENT + MCP Technology
            </div>

            <div className="space-y-1 mb-3 h-[320px] overflow-hidden">
              {mcpChatExample.slice(0, 4).map((message, idx) => {
                if (message.role === "system") {
                  return (
                    <div key={idx} className="text-[9px] text-white/60 italic text-center py-1">
                      <p>{message.content}</p>
                    </div>
                  )
                }

                if (message.role === "user") {
                  return (
                    <div
                      key={idx}
                      className="bg-transparent border border-white/20 rounded-xl p-1.5 text-[9px] flex items-start"
                    >
                      <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                        <Image
                          src={message.avatar || "/placeholder.svg"}
                          alt="User"
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-0.5">User:</p>
                        <p className="typing-effect">{message.content}</p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={idx}
                    className="bg-transparent border border-white/20 rounded-xl p-1.5 text-[9px] flex items-start"
                  >
                    <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                      <Image
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.name}
                        width={16}
                        height={16}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-0.5">{message.name}:</p>
                      <p className="typing-effect">{message.content}</p>
                    </div>
                  </div>
                )
              })}
              <div className="text-[9px] text-white/60 italic text-center">
                <p>3 days later...</p>
              </div>
              {mcpChatExample.slice(7, 9).map((message, idx) => {
                if (message.role === "user") {
                  return (
                    <div
                      key={`later-${idx}`}
                      className="bg-transparent border border-white/20 rounded-xl p-1.5 text-[9px] flex items-start"
                    >
                      <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                        <Image
                          src={message.avatar || "/placeholder.svg"}
                          alt="User"
                          width={16}
                          height={16}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-0.5">User:</p>
                        <p className="typing-effect">{message.content}</p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={`later-${idx}`}
                    className="bg-transparent border border-white/20 rounded-xl p-1.5 text-[9px] flex items-start"
                  >
                    <div className="flex-shrink-0 w-4 h-4 rounded-md overflow-hidden mr-1">
                      <Image
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.name}
                        width={16}
                        height={16}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-0.5">{message.name}:</p>
                      <p className="typing-effect">{message.content}</p>
                    </div>
                  </div>
                )
              })}
              <div className="text-[9px] text-white/60 italic text-center mt-2">
                <p className="font-medium">Context maintained with MCP technology</p>
                <p className="mt-1">Perfect recall of preferences, history, and past interactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Más compacto */}
        <div className="bg-black text-white rounded-xl shadow-sm p-4 text-center">
          <h3 className="text-lg md:text-xl font-medium tracking-tighter mb-2 leading-none">
            Experience the MCP Difference
          </h3>
          <p className="text-white/80 max-w-2xl mx-auto mb-3 text-xs">
            Join the next generation of business travel with AI agents powered by Model Context Protocol technology.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="bg-white text-black px-3 py-1 rounded-xl text-xs font-medium hover:bg-white/90 transition-colors">
              Try MCP Agents
            </button>
            <button className="bg-transparent border border-white px-3 py-1 rounded-xl text-xs font-medium hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MCPAIAgents
