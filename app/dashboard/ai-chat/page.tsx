"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Send, Square, Download, Loader2 } from "lucide-react"
import ChatMessage from "@/components/ai-chat/chat-message"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hey! 👋 Soy tu asistente de IA de Suitpax. Estoy aquí para ayudarte con todo lo relacionado con viajes de negocios, gestión de gastos, reservas de vuelos y mucho más.\n\n**¿En qué puedo ayudarte hoy?**\n\n- 🛫 Buscar y reservar vuelos\n- 💰 Gestionar gastos de viaje\n- 🏨 Encontrar hoteles\n- 📊 Analizar datos de viajes\n- 📋 Crear reportes\n- ❓ Responder cualquier pregunta\n\n¡Solo pregúntame lo que necesites!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Crear nuevo AbortController para esta request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          showReasoning,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.info("Generación cancelada")
      } else {
        console.error("Error en chat:", error)
        toast.error("Error al procesar tu mensaje. Por favor intenta de nuevo.")

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo o contacta a soporte si el problema persiste.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }

  const handleExportPDF = async () => {
    if (messages.length <= 1) {
      toast.error("No hay suficientes mensajes para exportar")
      return
    }

    setIsExportingPDF(true)

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.filter((msg) => msg.id !== "welcome"),
          title: "Conversación con Suitpax AI",
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Descargar el PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `suitpax-chat-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("¡PDF exportado exitosamente!")
    } catch (error) {
      console.error("Error exportando PDF:", error)
      toast.error("Error al exportar PDF. Por favor intenta de nuevo.")
    } finally {
      setIsExportingPDF(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-2">
            Chat con IA
          </h1>
          <p className="text-sm font-light text-gray-600">Tu asistente inteligente para viajes de negocios</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Switch para razonamiento */}
          <div className="flex items-center space-x-2">
            <Switch id="reasoning" checked={showReasoning} onCheckedChange={setShowReasoning} />
            <Label htmlFor="reasoning" className="text-xs font-medium">
              Mostrar razonamiento
            </Label>
          </div>

          {/* Botón exportar PDF */}
          <Button
            onClick={handleExportPDF}
            disabled={isExportingPDF || messages.length <= 1}
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
          >
            {isExportingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline">Exportar PDF</span>
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col bg-white/50 backdrop-blur-sm border-gray-200">
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center justify-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-white/20 mr-3">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    <Loader2 className="h-3 w-3 animate-spin text-white" />
                  </div>
                </div>
                <div className="bg-black/80 border border-white/10 text-white rounded-xl rounded-tl-none p-3 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="text-xs text-white/70 font-medium">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              disabled={isLoading}
              className="flex-1 bg-white border-gray-200 focus:border-gray-400 transition-colors"
              maxLength={2000}
            />

            {isLoading ? (
              <Button
                type="button"
                onClick={handleStop}
                variant="outline"
                size="icon"
                className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim()}
                size="icon"
                className="shrink-0 bg-black hover:bg-gray-800 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Character counter */}
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 font-light">Presiona Enter para enviar, Shift+Enter para nueva línea</p>
            <p className="text-xs text-gray-400 font-medium">{input.length}/2000</p>
          </div>
        </form>
      </Card>
    </div>
  )
}
