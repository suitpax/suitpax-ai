"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, Sparkles, UserIcon, BotIcon, PlaneIcon, HotelIcon, CreditCardIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

interface TravelUser {
  id: string
  full_name: string
  ai_tokens_used: number
  ai_tokens_limit: number
  plan_type: string
}

const QUICK_PROMPTS = [
  {
    icon: PlaneIcon,
    title: "Buscar vuelos",
    prompt: "Ayúdame a encontrar vuelos de Madrid a Londres para la próxima semana",
  },
  {
    icon: HotelIcon,
    title: "Hoteles de negocio",
    prompt: "Recomiéndame hoteles de negocio en el centro de Barcelona",
  },
  {
    icon: CreditCardIcon,
    title: "Gestión de gastos",
    prompt: "¿Cómo puedo optimizar mis gastos de viaje corporativo?",
  },
]

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [travelUser, setTravelUser] = useState<TravelUser | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/auth/login")
      return
    }

    const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    setTravelUser(userData)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content || loading) return

    if (!travelUser) {
      router.push("/auth/login")
      return
    }

    // Verificar límite de tokens
    if (travelUser.ai_tokens_used >= travelUser.ai_tokens_limit) {
      alert("Has alcanzado el límite de tokens IA. Actualiza tu plan para continuar.")
      router.push("/dashboard/billing")
      return
    }

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar mensaje")
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Actualizar tokens del usuario
      if (travelUser) {
        setTravelUser((prev) =>
          prev
            ? {
                ...prev,
                ai_tokens_used: prev.ai_tokens_used + (data.tokensUsed || 0),
              }
            : null,
        )
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const tokensPercentage = travelUser ? (travelUser.ai_tokens_used / travelUser.ai_tokens_limit) * 100 : 0

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <BotIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tighter">Asistente IA de Viajes</h1>
              <p className="text-sm text-gray-600">Powered by Claude 3.5 Sonnet</p>
            </div>
          </div>

          {travelUser && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">
                    {travelUser.ai_tokens_used.toLocaleString()} / {travelUser.ai_tokens_limit.toLocaleString()}
                  </span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(tokensPercentage, 100)}%` }}
                  />
                </div>
              </div>
              <Badge
                className={`${
                  travelUser.plan_type === "free"
                    ? "bg-gray-100 text-gray-800"
                    : travelUser.plan_type === "basic"
                      ? "bg-blue-100 text-blue-800"
                      : travelUser.plan_type === "pro"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {travelUser.plan_type.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BotIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-medium tracking-tighter mb-2">¡Hola! Soy tu asistente de viajes IA</h2>
                <p className="text-gray-600 max-w-md">
                  Estoy aquí para ayudarte con reservas de vuelos, hoteles, gestión de gastos y todo lo relacionado con
                  tus viajes de negocio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                {QUICK_PROMPTS.map((prompt, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => sendMessage(prompt.prompt)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <prompt.icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-medium text-sm">{prompt.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prompt.prompt}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="w-8 h-8">
                      {message.role === "user" ? (
                        <>
                          <AvatarFallback className="bg-black text-white">
                            <UserIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            <BotIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.timestamp && (
                        <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-3xl">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <BotIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Pensando...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje sobre viajes de negocio..."
            className="flex-1 rounded-xl"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-black text-white hover:bg-gray-800"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        {travelUser && tokensPercentage > 80 && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Te estás acercando al límite de tokens ({tokensPercentage.toFixed(1)}%).
              <button onClick={() => router.push("/dashboard/billing")} className="font-medium underline ml-1">
                Actualiza tu plan
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
