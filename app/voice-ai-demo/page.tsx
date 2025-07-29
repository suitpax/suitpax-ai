import VoiceAIDemo from "@/components/voice-ai/voice-ai-demo"

export default function VoiceAIDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-black mb-4">
            Demostración de Voice AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experimenta el futuro de la asistencia de viajes con nuestra tecnología de voz avanzada.
          </p>
        </div>

        <div className="flex justify-center">
          <VoiceAIDemo />
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Esta es una demostración simulada. La versión completa estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}
