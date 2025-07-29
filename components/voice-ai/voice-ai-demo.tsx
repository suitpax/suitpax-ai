"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Volume2 } from "lucide-react"

// Comandos de ejemplo para viajes (simplificados)
const travelCommands = [
  "buscar vuelo a Madrid",
  "reservar hotel en Barcelona",
  "mostrar mi itinerario",
  "ayuda con gastos",
]

export default function VoiceAIDemo() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      // Simular transcripción
      setTranscript("Buscar vuelo a Madrid para mañana")
      // Simular respuesta del AI
      setTimeout(() => {
        setResponse("He encontrado varios vuelos a Madrid para mañana. ¿Prefieres por la mañana o por la tarde?")
        setIsSpeaking(true)
        setTimeout(() => setIsSpeaking(false), 3000)
      }, 1000)
    } else {
      setIsListening(true)
      setTranscript("")
      setResponse("")
    }
  }

  const clearDemo = () => {
    setIsListening(false)
    setIsSpeaking(false)
    setTranscript("")
    setResponse("")
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium tracking-tighter text-black mb-4">Demo de Voice AI</h2>

          <p className="text-sm text-gray-600 mb-6">
            Demostración de las capacidades de voz de Suitpax. Haz clic en el micrófono para simular una conversación.
          </p>

          {/* Estado visual */}
          <div className="flex items-center justify-center mb-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? "bg-red-100 border-2 border-red-300 animate-pulse"
                  : isSpeaking
                    ? "bg-blue-100 border-2 border-blue-300 animate-pulse"
                    : "bg-gray-100 border-2 border-gray-200"
              }`}
            >
              {isListening ? (
                <Mic className="w-6 h-6 text-red-600" />
              ) : isSpeaking ? (
                <Volume2 className="w-6 h-6 text-blue-600" />
              ) : (
                <MicOff className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>

          {/* Estado del sistema */}
          <div className="text-center mb-4">
            <span
              className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-[10px] font-medium ${
                isListening
                  ? "bg-red-100 text-red-700"
                  : isSpeaking
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {isListening ? "Escuchando..." : isSpeaking ? "Hablando..." : "Listo"}
            </span>
          </div>

          {/* Transcripción */}
          {transcript && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-1">Tú dijiste:</p>
              <p className="text-sm text-gray-900">{transcript}</p>
            </div>
          )}

          {/* Respuesta del AI */}
          {response && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-600 mb-1">Asistente AI:</p>
              <p className="text-sm text-blue-900">{response}</p>
            </div>
          )}

          {/* Controles */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={toggleListening}
              className={`flex-1 ${isListening ? "bg-red-600 hover:bg-red-700" : "bg-gray-900 hover:bg-gray-800"}`}
              disabled={isSpeaking}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Detener
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Hablar
                </>
              )}
            </Button>

            <Button onClick={clearDemo} variant="outline" className="border-gray-200 bg-transparent">
              Limpiar
            </Button>
          </div>

          {/* Comandos de ejemplo */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Comandos de ejemplo:</h3>
            <ul className="text-xs space-y-1">
              {travelCommands.map((command, index) => (
                <li key={index} className="p-2 bg-gray-50 rounded-md text-gray-600">
                  "{command}"
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
