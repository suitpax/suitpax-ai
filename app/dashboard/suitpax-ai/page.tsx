"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowUp, Paperclip, X, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  ReasoningResponse,
} from "@/components/prompt-kit/reasoning"
import Markdown from "@/components/prompt-kit/markdown"
import ChatHeader from "@/components/prompt-kit/chat-header"
import FlightOffersBlock, { type ChatFlightOffer } from "@/components/prompt-kit/blocks/flight-offers-block"
import { useRouter } from "next/navigation"
import VoiceButton from "@/components/prompt-kit/voice-button"
import MetricsHUD from "@/components/prompt-kit/metrics-hud"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  reasoning?: string // Para el proceso de pensamiento real del AI
}

// Componente para el efecto typing
const TypingText: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ 
  text, 
  speed = 50, 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    // Reset cuando cambia el texto
    setDisplayedText("")
    setCurrentIndex(0)
  }, [text])

  return <span>{displayedText}</span>
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [files, setFiles] = useState<File[]>([])
  const [showReasoning, setShowReasoning] = useState(true)
  const [renderMarkdown, setRenderMarkdown] = useState(false)
  const [heroSubtitle, setHeroSubtitle] = useState("")
  const emptySubtitles = [
    "Travel. Expense. Policies.",
    "Voice and MCP agents.",
    "Real-time savings & compliance.",
    "Book smarter. Spend better.",
    "Context-aware travel ops.",
    "From intent to itinerary.",
    "Plan, approve, reconcile.",
  ]
  const [heroTitle, setHeroTitle] = useState("")
  const emptyTitles = [
    "Ask anything to Suitpax AI",
    "Plan business travel with AI",
    "Your AI copilot for travel & expense",
    "Search flights, hotels and policies",
    "Book smarter with MCP agents",
    "Travel, expense, and approvals — simplified",
    "From intent to itinerary in one flow",
    "Conversations that get trips done",
    "AI that understands your travel",
  ]
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const onReasoning = (e: any) => setShowReasoning(Boolean(e?.detail?.enabled))
    window.addEventListener("suitpax-reasoning-toggle", onReasoning as any)
    return () => window.removeEventListener("suitpax-reasoning-toggle", onReasoning as any)
  }, [])

  useEffect(() => {
    setHeroSubtitle(emptySubtitles[Math.floor(Math.random() * emptySubtitles.length)])
    setHeroTitle(emptyTitles[Math.floor(Math.random() * emptyTitles.length)])
  }, [])

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
    // Bloquear si ya hay loading o si el input está vacío
    if (!input.trim() || loading) return;

    setLoading(true);

    // Mensaje que se va a agregar cuando se reciba la respuesta
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // NO actualizar el estado del historial antes de la petición
    // Esto evita que history contenga el mensaje duplicado

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages, // Pasa aquí SÓLO el historial actual, sin el mensaje nuevo
          context: "travel_booking",
          includeReasoning: showReasoning,
        }),
      });

      if (!response.ok) {
        // Error de límites de tokens (plan agotado)
        if (response.status === 429) {
          const errData = await response.json();
          alert(
            errData.details?.message ||
            "You've reached your AI token limit for your current plan. Please upgrade or wait for your quota to reset."
          );
        } else {
          alert("Error fetching response from Suitpax AI. Please try again.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Parseador del bloque :::flight_offers_json
      let parsedOffers: Array<ChatFlightOffer> | null = null;
      const blockRegex = /:::flight_offers_json[\s\S]*?\n({[\s\S]*?})\n:::/;
      const match = typeof data.response === "string" ? data.response.match(blockRegex) : null;
      if (match && match[1]) {
        try {
          const obj = JSON.parse(match[1]);
          if (Array.isArray(obj?.offers)) parsedOffers = obj.offers;
        } catch {}
      }
      if (!parsedOffers && Array.isArray(data.offers)) {
        parsedOffers = data.offers;
      }

      // Solo ahora, agrega el mensaje del usuario y la respuesta del asistente
      const assistantId = (Date.now() + 1).toString()
      setMessages(prev => [
        ...prev,
        userMessage,
        {
          id: assistantId,
          content: typeof data.response === "string" ? data.response.replace(blockRegex, "").trim() : "",
          role: "assistant",
          timestamp: new Date(),
          reasoning: data.reasoning,
        },
      ]);

      // Renderiza las ofertas si existen
      if (parsedOffers && parsedOffers.length > 0) {
        const blockMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: JSON.stringify({ __type: "flight_offers", offers: parsedOffers }),
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, blockMessage]);
      }

      setInput("");
      setFiles([]);
      setTypingMessageId(assistantId);
    } catch (error) {
      // Manejo de errores
      setMessages(prev => [
        ...prev,
        userMessage,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: new Date(),
          reasoning: showReasoning
            ? "An error occurred while processing the request."
            : undefined,
        },
      ]);
      setTypingMessageId((Date.now() + 2).toString());
    } finally {
      setLoading(false);
    }
  }

  const handleTypingComplete = () => {
    setTypingMessageId(null)
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden" style={{ height: '100svh' }}>
      <ChatHeader className="flex-shrink-0" />
      <div className="flex-1 min-h-0" style={{ height: 'calc(100svh - 60px)' }}>
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tighter text-gray-900">{heroTitle}</h1>
                <p className="text-xs sm:text-sm text-gray-600 font-light mt-2">{heroSubtitle}</p>
              </div>
            )}
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "max-w-[85%] sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white"
                      : "max-w-[90%] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                        <Image
                          src="/logo/suitpax-bl-logo.webp"
                          alt="Suitpax AI"
                          width={24}
                          height={24}
                          className="w-full h-full object-contain p-0.5"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
                    </div>
                  )}

                  {/* Reasoning section - solo para mensajes del asistente con razonamiento */}
                  {message.role === "assistant" && message.reasoning && (
                    <div className="mb-3">
                      <Reasoning>
                        <ReasoningTrigger className="text-xs text-gray-300 hover:text-gray-500">
                          <span>View AI logic</span>
                        </ReasoningTrigger>
                        <ReasoningContent>
                          <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <ReasoningResponse
                              text={message.reasoning}
                              className="text-xs text-gray-700"
                            />
                          </div>
                        </ReasoningContent>
                      </Reasoning>
                    </div>
                  )}

                  {/* Main message content or structured blocks */}
                  {(() => {
                    // Detect synthetic flight offers block
                    if (message.role === "assistant" && typeof message.content === "string") {
                      try {
                        const parsed = JSON.parse(message.content)
                        if (parsed && parsed.__type === "flight_offers" && Array.isArray(parsed.offers)) {
                          const offers = parsed.offers as Array<ChatFlightOffer>
                          return (
                            <div className="mt-1">
                              <FlightOffersBlock
                                offers={offers}
                                onBook={(offer) => {
                                  const id = offer.offer_id || offer.id
                                  const url = offer.booking_url || (id ? `/dashboard/flights/book/${encodeURIComponent(id)}` : undefined)
                                  if (url) router.push(url)
                                }}
                                onDetails={(offer) => {
                                  const id = offer.offer_id || offer.id
                                  if (id) router.push(`/dashboard/flights/details/${encodeURIComponent(id)}`)
                                }}
                              />
                            </div>
                          )
                        }
                      } catch {}
                    }

                    // Default text rendering
                    if (message.role === "assistant") {
                      return typingMessageId === message.id ? (
                        <p className="text-sm font-light leading-relaxed break-words">
                          <TypingText text={message.content} speed={30} onComplete={handleTypingComplete} />
                        </p>
                      ) : (
                        renderMarkdown ? <Markdown>{message.content}</Markdown> : <p className="text-sm font-light leading-relaxed break-words">{message.content}</p>
                      )
                    }
                    return <p className="text-sm font-light leading-relaxed break-words">{message.content}</p>
                  })()}
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-gray-300" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 max-w-[95%] sm:max-w-sm md:max-w-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md overflow-hidden border border-gray-200 bg-white">
                      <Image
                        src="/agents/agent-2.png"
                        alt="Suitpax AI"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Suitpax AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                    <span className="text-sm text-gray-600 font-light">
                      {showReasoning ? "Analyzing and thinking..." : "Thinking..."}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </ChatContainerContent>
          
          {/* Scroll Anchor para auto-scroll */}
          <ChatContainerScrollAnchor />
          
          {/* Scroll Button flotante */}
          <ScrollButton className="bottom-20 sm:bottom-24 right-4 sm:right-6" />
          <MetricsHUD visible={false} estimatedInputTokens={Math.ceil((input + JSON.stringify(messages)).length / 4)} estimatedOutputTokens={800} />
        </ChatContainerRoot>
      </div>

      {/* Input con PromptInput - Altura fija responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/50 backdrop-blur-sm border-t border-gray-200 flex-shrink-0"
        style={{ minHeight: '4rem' }}
      >
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <PromptInput
              value={input}
              onValueChange={setInput}
              isLoading={loading}
              onSubmit={handleSend}
              className="w-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Archivos adjuntos */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 flex items-center gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                      onClick={e => e.stopPropagation()}
                    >
                      <Paperclip className="size-3 sm:size-4 text-gray-600" />
                      <span className="max-w-[80px] sm:max-w-[120px] truncate text-gray-700">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="hover:bg-gray-200 rounded-full p-1 transition-colors"
                      >
                        <X className="size-3 sm:size-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <PromptInputTextarea 
                placeholder="Ask me about flights, hotels, or travel planning..." 
                className="text-gray-900 placeholder-gray-500 font-light text-sm sm:text-base"
                disabled={loading}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />

              <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowReasoning(v => !v) }}
                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${showReasoning ? 'bg-black' : 'bg-gray-300'}`}
                    aria-label="Toggle reasoning"
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showReasoning ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-[11px] text-gray-600 font-light select-none">Reasoning</span>
                </div>
                <PromptInputAction tooltip="Attach files">
                  <label
                    htmlFor="file-upload"
                    className="hover:bg-gray-100 flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-2xl transition-colors"
                  >
                    <input
                      ref={uploadInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Paperclip className="text-gray-600 size-4 sm:size-5" />
                  </label>
                </PromptInputAction>
                <PromptInputAction tooltip="Voice input">
                  <VoiceButton onTranscript={(text) => { setInput((prev) => (prev ? prev + " " : "") + text); }} />
                </PromptInputAction>

                <PromptInputAction
                  tooltip={loading ? "Stop generation" : "Send message"}
                >
                  <Button
                    variant="default"
                    size="icon"
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-2xl ${loading ? 'bg-gray-200 text-gray-600' : 'bg-black text-white hover:bg-gray-800'}`}
                    onClick={() => {
                      if (loading) return
                      handleSend()
                    }}
                  >
                    {loading ? <Square className="size-4" /> : <ArrowUp className="size-4" />}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
