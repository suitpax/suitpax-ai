"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Paperclip, Download, Send, X, Sparkles, Bot, User, Zap, Brain, MessageCircle } from "lucide-react"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { useFileUpload } from "@/hooks/use-file-upload"
import { generateChatPDF, formatFileSize, getFileIcon } from "@/lib/pdf-utils"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "file" | "image"
  attachments?: Array<{
    name: string
    type: string
    size: number
  }>
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-1">
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500 ml-2">Suitpax AI is thinking...</span>
  </div>
)

const MessageBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
  >
    <div className={`flex items-start space-x-3 max-w-[85%] ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            isUser
              ? "bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg"
              : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-6 py-4 rounded-3xl shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-br-lg"
              : "bg-white border border-gray-100 text-gray-900 rounded-bl-lg shadow-md"
          }`}
        >
          {!isUser && (
            <div className="flex items-center mb-2 pb-2 border-b border-gray-100">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax AI"
                width={70}
                height={16}
                className="h-4 w-auto opacity-80"
              />
              <Sparkles className="w-3 h-3 ml-2 text-blue-500" />
            </div>
          )}

          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200/20">
              <div className="flex flex-wrap gap-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-100/10 rounded-lg px-3 py-2">
                    {getFileIcon(attachment.type)}
                    <span className="text-xs font-medium truncate max-w-24">{attachment.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={`mt-2 flex items-center space-x-2 text-xs text-gray-500 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
        >
          <span>
            {message.timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {!isUser && (
            <>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>AI Response</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </motion.div>
)

export default function SuitpaxChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Suitpax AI, your intelligent travel assistant. I can help you with flight bookings, hotel reservations, expense management, and travel policies. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Speech to text hook
  const {
    transcript,
    isListening,
    isSupported: speechSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({
    language: "en-US",
    continuous: false,
    interimResults: true,
  })

  // File upload hook
  const {
    files,
    isUploading,
    error: fileError,
    uploadFiles,
    removeFile,
    clearFiles,
  } = useFileUpload({
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    multiple: true,
  })

  // Update input when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const handleSendMessage = async () => {
    if (!input.trim() && files.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || `Shared ${files.length} file(s)`,
      timestamp: new Date(),
      attachments: files.map((f) => ({
        name: f.name,
        type: f.type,
        size: f.size,
      })),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    resetTranscript()

    try {
      const requestBody = {
        message: input.trim(),
        files: files.map((f) => ({
          name: f.name,
          type: f.type,
          size: f.size,
          content: f.content,
        })),
      }

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Server response error")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process your request.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      clearFiles()
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, there was an error processing your message. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      uploadFiles(selectedFiles)
    }
  }

  const handleExportPDF = async () => {
    try {
      await generateChatPDF(messages, "Suitpax AI Conversation")
    } catch (error) {
      console.error("Error exporting PDF:", error)
    }
  }

  const toggleSpeech = () => {
    if (isListening) {
      stopListening()
      setIsRecording(false)
    } else {
      startListening()
      setIsRecording(true)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <Card className="flex-1 flex flex-col border-0 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
        {/* Header */}
        <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Suitpax AI Assistant
                </h1>
                <p className="text-sm text-gray-500 font-medium">Powered by advanced AI • Always learning</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-700">Online</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={messages.length <= 1}
                className="rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />

          {/* Messages */}
          <ScrollArea className="flex-1 relative z-10">
            <div className="p-6 space-y-1">
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} isUser={message.role === "user"} />
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-6"
                >
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <div className="relative">
                        <Bot className="w-5 h-5 text-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-lg shadow-md px-6 py-4">
                      <TypingIndicator />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* File Attachments */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-100/50 bg-gray-50/50 backdrop-blur-sm p-4 relative z-10"
              >
                <div className="flex flex-wrap gap-3">
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="border-t border-gray-100/50 bg-white/80 backdrop-blur-sm p-6 relative z-10">
            {/* Error messages */}
            <AnimatePresence>
              {(speechError || fileError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>{speechError || fileError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Ask me anything about your business travel..."}
                  disabled={isLoading || isListening}
                  className={`pr-4 pl-6 py-4 text-base rounded-2xl border-2 transition-all duration-200 bg-white/90 backdrop-blur-sm ${
                    isListening
                      ? "border-red-300 bg-red-50/50 shadow-lg shadow-red-100"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500 shadow-sm"
                  }`}
                />
                {isRecording && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs text-red-600 font-medium">Recording</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice button */}
              {speechSupported && (
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="lg"
                  onClick={toggleSpeech}
                  disabled={isLoading}
                  className={`rounded-2xl w-14 h-14 transition-all duration-200 ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                      : "border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              )}

              {/* File upload button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="rounded-2xl w-14 h-14 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              {/* Send button */}
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || (!input.trim() && files.length === 0)}
                size="lg"
                className="rounded-2xl w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-200 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Book a flight to NYC", "Find hotels in London", "Expense report help", "Travel policy questions"].map(
                (suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 text-gray-700 font-medium"
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
