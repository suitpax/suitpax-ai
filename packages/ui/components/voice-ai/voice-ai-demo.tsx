"use client"
import { VoiceAIProvider, type VoiceCommand } from "@/contexts/voice-ai-context"
import VoiceControlPanel from "./voice-control-panel"
import { ELEVENLABS_VOICES } from "@/lib/elevenlabs"

// Comandos de ejemplo para viajes
const travelCommands: VoiceCommand[] = [
  {
    phrase: "buscar vuelo",
    action: () => console.log("Buscando vuelos..."),
    description: "Busca vuelos disponibles",
  },
  {
    phrase: "reservar hotel",
    action: () => console.log("Buscando hoteles..."),
    description: "Busca hoteles disponibles",
  },
  {
    phrase: "mostrar itinerario",
    action: () => console.log("Mostrando itinerario..."),
    description: "Muestra tu itinerario actual",
  },
  {
    phrase: "ayuda",
    action: () => console.log("Mostrando ayuda..."),
    description: "Muestra la ayuda disponible",
  },
]

export default function VoiceAIDemo() {
  return (
    <VoiceAIProvider
      initialVoiceId={ELEVENLABS_VOICES.EMMA}
      initialLanguage="es-ES"
      enableLogging={true}
      commands={travelCommands}
    >
      <div className="w-full max-w-md mx-auto p-4">
        <h2 className="text-xl font-medium mb-4">Demo de Voice AI</h2>
        <p className="text-sm text-gray-600 mb-6">
          Este componente demuestra las capacidades de voz de Suitpax. Puedes hablar con el asistente y probar
          diferentes configuraciones.
        </p>

        <VoiceControlPanel />

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Comandos disponibles:</h3>
          <ul className="text-xs space-y-1">
            {travelCommands.map((command, index) => (
              <li key={index} className="p-2 bg-gray-50 rounded-md">
                <span className="font-medium">"{command.phrase}"</span>
                {command.description && <span className="text-gray-500 ml-2">- {command.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </VoiceAIProvider>
  )
}
