"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  Sparkles,
  Send,
  Paperclip,
  X,
  BrainCircuitIcon,
  MicroscopeIcon as MagnifyingGlassIcon,
  PlusIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  ArrowRight,
  Volume2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  reasoning?: string
  sources?: Array<{ title: string; url: string }>
}

export default function SuitpaxAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; completed: boolean; createdAt: Date }>>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const totalQueries = messages.length
  const tokensUsed = messages.reduce((acc, msg) => acc + msg.content.length * 0.75, 0)
  const sessionsToday = currentSessionId ? 1 : 0

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsUserLoading(false)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/suitpax-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          userId: user?.id || "anonymous",
          conversationHistory: messages.slice(-10), // Last 10 messages for context
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => {
    sendMessage(input)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const promptSuggestions = [
    {
      category: "Flight & Travel",
      prompts: [
        "Find business class flights from NYC to London next week",
        "Search for the cheapest flights to Tokyo in March",
        "Plan a 3-day business trip to Berlin with hotel recommendations",
      ],
    },
    {
      category: "Expense Management",
      prompts: [
        "Analyze my travel expenses from last month",
        "Check if my hotel booking complies with company policy",
        "Generate an expense report for my recent trip",
      ],
    },
    {
      category: "Document Processing",
      prompts: [
        "Extract data from my uploaded receipt",
        "Summarize this contract document",
        "Generate a travel itinerary from my email confirmations",
      ],
    },
  ]

  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date(),
    }

    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle("")
  }

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium tracking-tight">Loading your AI assistant...</p>
        </motion.div>
      </div>
    )
  }

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
        <BrainCircuitIcon className="h-10 w-10 text-gray-500" />
      </div>
      <h3 className="text-2xl font-medium tracking-tighter text-gray-900 mb-3">Welcome to Suitpax AI</h3>
      <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
        Your intelligent business travel assistant. Start a conversation or create tasks to get organized.
      </p>

      <div className="max-w-md mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Create your first task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
          />
          <Button
            onClick={addTask}
            disabled={!newTaskTitle.trim()}
            className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-6 py-3 font-medium tracking-tight"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="max-w-md mx-auto space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  task.completed ? "bg-gray-900 border-gray-900" : "border-gray-300"
                }`}
              >
                {task.completed && <CheckIcon className="h-3 w-3 text-white" />}
              </button>
              <span className={`flex-1 text-left ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-8 p-4 lg:p-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none text-gray-900 mb-2">
              Suitpax AI
            </h1>
            <p className="text-lg font-light text-gray-600">Your intelligent business travel assistant</p>
          </div>
          <Link href="/dashboard/voice-ai">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Volume2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Voice AI</p>
                    <p className="text-xs text-gray-600">Advanced voice features</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={showReasoning}
              onCheckedChange={setShowReasoning}
              className="data-[state=checked]:bg-gray-900"
            />
            <span className="text-sm font-medium text-gray-700">Show reasoning</span>
          </div>
        </div>

        <Button
          onClick={() => {
            setMessages([])
            setCurrentSessionId(null)
            setTasks([])
          }}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-6 py-3 font-medium tracking-tight"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Session
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <Button
          onClick={() => {
            setMessages([])
            setCurrentSessionId(null)
            setTasks([])
          }}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-6 py-3 font-medium tracking-tight"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Session
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-0">
            <div className="h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {(searchQuery ? filteredMessages : messages).map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-3xl rounded-2xl p-6 ${
                            message.role === "user"
                              ? "bg-gray-900 text-white"
                              : "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900 shadow-sm"
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className={`prose max-w-none ${message.role === "user" ? "prose-invert" : ""}`}
                            components={{
                              code: ({ node, inline, className, children, ...props }) => {
                                if (inline) {
                                  return (
                                    <code
                                      className={`px-2 py-1 rounded text-sm ${
                                        message.role === "user" ? "bg-white/20" : "bg-gray-200"
                                      }`}
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  )
                                }
                                return (
                                  <pre
                                    className={`p-4 rounded-xl overflow-x-auto ${
                                      message.role === "user" ? "bg-black/30" : "bg-gray-100"
                                    }`}
                                  >
                                    <code className="text-sm" {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                )
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>

                          {message.reasoning && showReasoning && (
                            <details
                              className={`mt-4 p-4 rounded-xl border ${
                                message.role === "user" ? "bg-white/10 border-white/20" : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <summary className="cursor-pointer text-sm font-medium mb-2 flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                AI Reasoning Process
                              </summary>
                              <div className="text-sm whitespace-pre-wrap opacity-80">{message.reasoning}</div>
                            </details>
                          )}

                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-xs font-medium opacity-70">Sources:</p>
                              {message.sources.map((source, idx) => (
                                <a
                                  key={idx}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`block text-xs underline ${
                                    message.role === "user"
                                      ? "text-blue-300 hover:text-blue-200"
                                      : "text-blue-600 hover:text-blue-800"
                                  }`}
                                >
                                  {source.title}
                                </a>
                              ))}
                            </div>
                          )}

                          <div className={`text-xs mt-3 opacity-60`}>{message.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-gray-900"></div>
                            <span className="text-sm text-gray-700 font-medium">AI is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50/50">
                {files.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm"
                      >
                        <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                        <button
                          onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end gap-4">
                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about flights, hotels, expenses, or anything else..."
                      disabled={isLoading}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 rounded-2xl resize-none min-h-[60px] pr-32 focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                      rows={1}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 rounded-xl"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-6 bg-white/95 border-gray-200 backdrop-blur-sm rounded-2xl shadow-lg">
                          <div className="space-y-6">
                            {promptSuggestions.map((category) => (
                              <div key={category.category} className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-900">{category.category}</h4>
                                <div className="space-y-2">
                                  {category.prompts.map((prompt) => (
                                    <button
                                      key={prompt}
                                      onClick={() => setInput(prompt)}
                                      className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700 border border-gray-200"
                                    >
                                      {prompt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      <input
                        ref={uploadInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setFiles([...files, ...Array.from(e.target.files)])
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 rounded-xl"
                        onClick={() => uploadInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || (!input.trim() && files.length === 0)}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl px-8 py-4 font-medium tracking-tight transition-colors shadow-lg"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
