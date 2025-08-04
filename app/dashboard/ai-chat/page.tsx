"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChatContainer } from "@/components/prompt-kit/chat-container"
import { PageHeader } from "@/components/layout/page-header"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string // Para el proceso de pensamiento real del AI
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! I'm your AI assistant from Suitpax. How can I help you plan your next business trip?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = ""
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          context: "travel_booking",
          includeReasoning: showReasoning,
        }),
        signal,
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
        reasoning: data.reasoning,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setTypingMessageId(assistantMessage.id)
      setInput("")
    } catch (error) {
      if ((error as any).name === "AbortError") {
        // Petición cancelada, restaurar input para editar
        setInput(userMessage.content)
      } else {
        console.error("Error enviando mensaje:", error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: new Date(),
          reasoning: showReasoning
            ? "An error occurred while processing the request. The system attempted to maintain connection and provide a helpful response despite technical difficulties."
            : undefined,
        }
        setMessages((prev) => [...prev, errorMessage])
        setTypingMessageId(errorMessage.id)
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setLoading(false)
      setTypingMessageId(null)
    }
  }

  const handleTypingComplete = () => {
    setTypingMessageId(null)
  }

  const generateAndDownloadPDF = async () => {
    if (pdfLoading || messages.length === 0) return

    setPdfLoading(true)
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          title: "Suitpax AI Chat Export",
          userInfo: {
            email: user?.email,
            name: user?.user_metadata?.full_name,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `suitpax-ai-chat-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Suitpax AI" description="Your intelligent business travel assistant" />

      <div className="flex-1 overflow-hidden">
        <ChatContainer className="h-full" />
      </div>
    </div>
  )
}
