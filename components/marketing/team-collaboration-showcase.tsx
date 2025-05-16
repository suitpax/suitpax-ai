"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  CheckCircle2,
  PlusCircle,
  FileText,
  BarChart3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample data for chat messages
const chatMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    avatar: "/community/ashton-blackwell.webp",
    message: "Team, I've just updated the travel policy document with the new expense limits.",
    time: "10:32 AM",
    unread: false,
  },
  {
    id: 2,
    sender: "Michael Chen",
    avatar: "/community/jordan-burgess.webp",
    message: "Thanks Sarah! I'll review it and share with the procurement team.",
    time: "10:35 AM",
    unread: false,
  },
  {
    id: 3,
    sender: "Emma Wilson",
    avatar: "/community/bec-ferguson.webp",
    message: "Quick question - does this apply to the executive travel arrangements too?",
    time: "10:38 AM",
    unread: false,
  },
  {
    id: 4,
    sender: "Sarah Johnson",
    avatar: "/community/ashton-blackwell.webp",
    message:
      "Yes, it applies to all levels. I've included a special section for executive travel with the appropriate adjustments.",
    time: "10:40 AM",
    unread: false,
  },
]

// Sample data for shared documents
const sharedDocuments = [
  {
    id: 1,
    title: "Q2 Travel Policy Update",
    type: "PDF",
    updatedBy: "Sarah Johnson",
    updatedAt: "Today at 10:15 AM",
  },
  {
    id: 2,
    title: "Executive Travel Guidelines",
    type: "DOCX",
    updatedBy: "Michael Chen",
    updatedAt: "Yesterday at 4:30 PM",
  },
  {
    id: 3,
    title: "Expense Report Template",
    type: "XLSX",
    updatedBy: "Emma Wilson",
    updatedAt: "May 15, 2023",
  },
]

// Sample data for team tasks
const teamTasks = [
  {
    id: 1,
    title: "Review updated travel policy",
    assignee: "Michael Chen",
    avatar: "/community/jordan-burgess.webp",
    dueDate: "Today",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Distribute policy to department heads",
    assignee: "Emma Wilson",
    avatar: "/community/bec-ferguson.webp",
    dueDate: "Tomorrow",
    status: "Not Started",
  },
  {
    id: 3,
    title: "Schedule policy training session",
    assignee: "Sarah Johnson",
    avatar: "/community/ashton-blackwell.webp",
    dueDate: "May 20, 2023",
    status: "Not Started",
  },
]

// Sample data for upcoming meetings
const upcomingMeetings = [
  {
    id: 1,
    title: "Q2 Travel Budget Review",
    date: "May 18, 2023",
    time: "10:00 AM - 11:30 AM",
    location: "Conference Room A / Zoom",
    attendees: [
      "/community/ashton-blackwell.webp",
      "/community/jordan-burgess.webp",
      "/community/bec-ferguson.webp",
      "/community/scott-clayton.webp",
    ],
    status: "Confirmed",
  },
  {
    id: 2,
    title: "New Vendor Presentation",
    date: "May 20, 2023",
    time: "2:00 PM - 3:00 PM",
    location: "Virtual Meeting",
    attendees: ["/community/ashton-blackwell.webp", "/community/jordan-burgess.webp", "/community/isobel-fuller.webp"],
    status: "Pending",
  },
]

// AI Agent suggestions for business travel
const aiSuggestions = [
  {
    id: 1,
    title: "Optimize NYC trip for sales team",
    description:
      "I've analyzed the sales team's schedule and can suggest hotel options near most of their meetings to reduce transit time.",
    savings: "$1,200 estimated savings",
    impact: "4.5 hours saved in transit time",
  },
  {
    id: 2,
    title: "Bulk booking opportunity",
    description:
      "5 team members are traveling to Chicago next month. Booking together could qualify for group discounts.",
    savings: "$800 estimated savings",
    impact: "Simplified expense reporting",
  },
  {
    id: 3,
    title: "Policy compliance alert",
    description:
      "3 recent bookings exceeded the daily hotel allowance. Would you like me to send a friendly policy reminder?",
    savings: "Improved compliance rate",
    impact: "Streamlined approval process",
  },
]

const TeamCollaborationShowcase = () => {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(chatMessages)
  const [showResponse, setShowResponse] = useState(false)
  const [showAiSuggestion, setShowAiSuggestion] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")

  // Function to send a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      avatar: "/community/scott-clayton.webp",
      message: newMessage,
      time: "Just now",
      unread: false,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
    setShowResponse(true)
  }

  // Simulate automatic response
  useEffect(() => {
    if (showResponse) {
      const timer = setTimeout(() => {
        const responseMsg = {
          id: messages.length + 2,
          sender: "Sarah Johnson",
          avatar: "/community/ashton-blackwell.webp",
          message: "Thanks for your input! I'll incorporate your suggestions into the next revision.",
          time: "Just now",
          unread: true,
        }
        setMessages((prev) => [...prev, responseMsg])
        setShowResponse(false)
        setShowAiSuggestion(true)

        // Scroll to the end of the chat
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showResponse, messages])

  // AI suggestion after a delay
  useEffect(() => {
    if (showAiSuggestion) {
      const timer = setTimeout(() => {
        const aiMsg = {
          id: messages.length + 3,
          sender: "Suitpax AI Assistant",
          avatar: "/agents/agent-30.png",
          message:
            "I've prepared a draft for your next team meeting about business travel. Would you like me to schedule it and send invitations to the team?",
          time: "Just now",
          unread: true,
          isAi: true,
          actions: ["Schedule meeting", "View draft", "No thanks"],
        }
        setMessages((prev) => [...prev, aiMsg])
        setShowAiSuggestion(false)

        // Scroll to the end of the chat
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAiSuggestion, messages])

  // Scroll to the end of the chat when a message is sent
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
              <Image src="/logo/suitpax-green-logo.webp" alt="Suitpax" width={16} height={16} className="mr-1.5" />
              Suitpax Teams
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse mr-1"></span>
              Real-time collaboration
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none">
            Frictionless collaboration for travel teams
          </h2>
          <p className="mt-3 text-sm font-light text-gray-600 max-w-2xl mb-4">
            Connect your team, share documents, and coordinate tasks in a unified workspace specifically designed for
            corporate travel management
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main collaboration panel */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === "chat" ? "text-emerald-950 border-b-2 border-emerald-950" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Team Chat
                </button>
                <button
                  onClick={() => setActiveTab("meetings")}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === "meetings" ? "text-emerald-950 border-b-2 border-emerald-950" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Meetings
                </button>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`px-4 py-3 text-sm font-medium ${activeTab === "insights" ? "text-emerald-950 border-b-2 border-emerald-950" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Travel Insights
                </button>
              </div>
            </div>

            {activeTab === "chat" && (
              <>
                <div ref={chatRef} className="p-4 h-[320px] overflow-y-auto">
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex gap-3 mb-4 ${msg.sender === "You" ? "justify-end" : ""}`}
                      >
                        {msg.sender !== "You" && (
                          <div className="flex-shrink-0">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={msg.avatar || "/placeholder.svg"}
                                alt={msg.sender}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div className={`max-w-[70%] ${msg.sender === "You" ? "order-1" : "order-2"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-black">{msg.sender}</span>
                            {msg.isAi && (
                              <Badge
                                variant="outline"
                                className="text-[9px] py-0 h-4 bg-emerald-50 text-emerald-950 border-emerald-200"
                              >
                                AI Assistant
                              </Badge>
                            )}
                            <span className="text-[10px] text-gray-500">{msg.time}</span>
                          </div>
                          <div
                            className={`p-3 rounded-xl text-sm ${
                              msg.sender === "You"
                                ? "bg-gray-100 text-black"
                                : msg.isAi
                                  ? "bg-emerald-50 border border-emerald-200 text-black"
                                  : "bg-gray-50 border border-gray-200 text-black"
                            }`}
                          >
                            {msg.message}

                            {msg.actions && (
                              <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-200">
                                {msg.actions.map((action, i) => (
                                  <button
                                    key={i}
                                    className={`text-xs px-3 py-1 rounded-full ${
                                      i === 0
                                        ? "bg-emerald-100 text-emerald-950 hover:bg-emerald-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {msg.sender === "You" && (
                          <div className="flex-shrink-0 order-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={msg.avatar || "/placeholder.svg"}
                                alt={msg.sender}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 p-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-300"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 text-gray-700 hover:text-emerald-950 transition-colors"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "meetings" && (
              <div className="p-4 h-[380px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-black">Upcoming Meetings</h3>
                  <button className="text-xs flex items-center gap-1 text-emerald-950 hover:text-emerald-800">
                    <PlusCircle className="h-3 w-3" />
                    New Meeting
                  </button>
                </div>

                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-black">{meeting.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-[9px] ${
                            meeting.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {meeting.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{meeting.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {meeting.attendees.map((avatar, i) => (
                            <div
                              key={i}
                              className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white"
                            >
                              <Image src={avatar || "/placeholder.svg"} alt="Attendee" fill className="object-cover" />
                            </div>
                          ))}
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-600 border-2 border-white">
                            +2
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button className="p-1 text-gray-600 hover:text-emerald-950 transition-colors">
                            <FileText className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-emerald-950 transition-colors">
                            <Video className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-xl text-center">
                  <p className="text-sm text-gray-500">
                    Your AI assistant can help schedule and organize team meetings
                  </p>
                  <button className="mt-2 text-xs text-emerald-950 font-medium flex items-center justify-center gap-1 mx-auto">
                    <Users className="h-3 w-3" />
                    Ask AI to schedule a meeting
                  </button>
                </div>
              </div>
            )}

            {activeTab === "insights" && (
              <div className="p-4 h-[380px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-black">Travel Insights & Recommendations</h3>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-950 border-emerald-200">
                    AI Powered
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Monthly Travel Spend</h4>
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-2xl font-medium text-black">$24,850</p>
                    <div className="flex items-center gap-1 text-xs text-emerald-950">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>12% under budget</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Upcoming Trips</h4>
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-2xl font-medium text-black">8</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>Next 30 days</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-black mb-3">AI Recommendations</h4>
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-emerald-200">
                          <Image
                            src="/agents/agent-30.png"
                            alt="AI Assistant"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-black">{suggestion.title}</h5>
                          <p className="text-xs text-gray-700 mb-1">{suggestion.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-950 rounded-full">
                              {suggestion.savings}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                              {suggestion.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side panel with documents and tasks */}
          <div className="space-y-4">
            {/* Team members */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-medium text-black text-sm">Team Members</h3>
              </div>
              <div className="p-3">
                <div className="flex flex-wrap gap-2">
                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-200">
                      <Image src="/community/ashton-blackwell.webp" alt="Sarah Johnson" fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <span className="text-[9px] mt-1">Sarah</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src="/community/jordan-burgess.webp" alt="Michael Chen" fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <span className="text-[9px] mt-1">Michael</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src="/community/bec-ferguson.webp" alt="Emma Wilson" fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-300 rounded-full border border-white"></div>
                    </div>
                    <span className="text-[9px] mt-1">Emma</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src="/community/scott-clayton.webp" alt="You" fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <span className="text-[9px] mt-1">You</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center border-2 border-emerald-200">
                      <Image src="/agents/agent-30.png" alt="AI Assistant" fill className="object-cover" />
                    </div>
                    <span className="text-[9px] mt-1">AI</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
                      <PlusCircle className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] mt-1">Invite</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shared documents */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-medium text-black text-sm">Shared Documents</h3>
              </div>
              <div className="p-2">
                {sharedDocuments.map((doc) => (
                  <div key={doc.id} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-700">
                        {doc.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-black truncate">{doc.title}</h4>
                        <p className="text-[10px] text-gray-500">
                          Updated by {doc.updatedBy} • {doc.updatedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team tasks */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-medium text-black text-sm">Team Tasks</h3>
              </div>
              <div className="p-2">
                {teamTasks.map((task) => (
                  <div key={task.id} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-black truncate">{task.title}</h4>
                        <div className="flex items-center gap-1">
                          <div className="relative w-4 h-4 rounded-full overflow-hidden">
                            <Image
                              src={task.avatar || "/placeholder.svg"}
                              alt={task.assignee}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[10px] text-gray-500">
                            {task.assignee} • Due: {task.dueDate}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                          task.status === "In Progress"
                            ? "bg-emerald-100 text-emerald-950"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Travel Assistant */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-black text-sm">AI Travel Assistant</h3>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-950 border-emerald-200 text-[9px]">
                  Premium
                </Badge>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-200">
                    <Image
                      src="/agents/agent-30.png"
                      alt="AI Assistant"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Morgan</h4>
                    <p className="text-[10px] text-gray-500">Travel Planning Specialist</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-3">
                  <p className="text-xs text-gray-700">
                    I've prepared a draft agenda for your next team meeting on business travel policy updates. Would you
                    like me to schedule it?
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-950 rounded-lg hover:bg-emerald-200 transition-colors flex-1">
                    View agenda
                  </button>
                  <button className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1">
                    Schedule meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Suitpax Teams seamlessly integrates with your existing workflow, enabling smooth collaboration between
            departments and travel teams.
          </p>
        </div>
      </div>
    </section>
  )
}

export default TeamCollaborationShowcase
