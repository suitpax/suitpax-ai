"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Paperclip, Download, Send, X } from "lucide-react"
import { useSpeechToText } from "@/hooks/use-speech-to-text"
import { useFileUpload } from "@/hooks/use-file-upload"
import { generateChatPDF, formatFileSize, getFileIcon } from "@/lib/pdf-utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function SuitpaxChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "¡Hola! Soy Zia, tu asistente de viajes de IA. ¿En qué puedo ayudarte hoy? Puedes escribir, hablar o subir archivos.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    language: "es-ES",
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

  const handleSendMessage = async () => {
    if (!input.trim() && files.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || `[${files.length} archivo(s) adjunto(s)]`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    resetTranscript()

    try {
      // Prepare the request body
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
        throw new Error("Error en la respuesta del servidor")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Lo siento, no pude procesar tu solicitud.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      clearFiles()
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
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
      await generateChatPDF(messages, "Conversación Suitpax AI")
    } catch (error) {
      console.error("Error exporting PDF:", error)
    }
  }

  const toggleSpeech = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-medium">Chat con Zia AI</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={messages.length <= 1}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      <span className="text-sm text-gray-600">Zia está escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* File attachments */}
          {files.length > 0 && (
            <div className="border-t p-4">
              <div className="flex flex-wrap gap-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 text-sm">
                    <span>{getFileIcon(file.type)}</span>
                    <span className="truncate max-w-32">{file.name}</span>
                    <span className="text-gray-500">({formatFileSize(file.size)})</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t p-4">
            {/* Error messages */}
            {(speechError || fileError) && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {speechError || fileError}
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Escuchando..." : "Escribe tu mensaje..."}
                  disabled={isLoading || isListening}
                  className={isListening ? "border-red-300 bg-red-50" : ""}
                />
              </div>

              {/* Voice button */}
              {speechSupported && (
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleSpeech}
                  disabled={isLoading}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}

              {/* File upload button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Send button */}
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || (!input.trim() && files.length === 0)}
                size="icon"
              >
                <Send className="h-4 w-4" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
