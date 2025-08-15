import { useState, useRef, useCallback } from 'react'

interface VoiceMessage {
  id: string
  type: 'user' | 'agent'
  content: string
  audioUrl?: string
  timestamp: Date
}

interface UseVoiceAIProps {
  agentId: string
  onMessage?: (message: VoiceMessage) => void
  onError?: (error: Error) => void
  onStatusChange?: (status: string) => void
}

export function useVoiceAIConsolidated({
  agentId,
  onMessage,
  onError,
  onStatusChange
}: UseVoiceAIProps) {
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [audioState, setAudioState] = useState({ isPlaying: false })
  
  const audioPlayerRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)

  // Inicializar Speech Recognition
  const browserSupportsSpeechRecognition = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const initializeSpeechRecognition = useCallback(() => {
    if (!browserSupportsSpeechRecognition) return null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript
      setTranscript(speechResult)
      
      // Crear mensaje del usuario
      const userMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: speechResult,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      onMessage?.(userMessage)
      
      // Procesar con Anthropic + ElevenLabs
      await processVoiceInput(speechResult)
    }

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`)
      onError?.(new Error(event.error))
      setStatus('idle')
    }

    return recognition
  }, [browserSupportsSpeechRecognition, onMessage, onError])

  // Procesar entrada de voz (Anthropic + ElevenLabs)
  const processVoiceInput = async (userInput: string) => {
    try {
      setStatus('processing')
      onStatusChange?.('processing')
      
      // 1. Obtener respuesta de Anthropic
      const conversationResponse = await fetch('/api/voice-ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: userInput,
          context: `Agent: ${agentId}`,
        }),
      })

      if (!conversationResponse.ok) {
        throw new Error('Failed to get AI response')
      }

      // 2. Leer el stream de Anthropic
      const reader = conversationResponse.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponseText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          aiResponseText += chunk
        }
      }

      // 3. Limpiar la respuesta (remover caracteres de control)
      const cleanResponse = aiResponseText
        .replace(/data: /g, '')
        .replace(/\n\n/g, '')
        .replace(/\[DONE\]/g, '')
        .trim()

      if (!cleanResponse) {
        throw new Error('Empty response from AI')
      }

      // 4. Generar audio con ElevenLabs
      setStatus('speaking')
      onStatusChange?.('speaking')
      
      const ttsResponse = await fetch('/api/elevenlabs/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanResponse,
          agentId: agentId,
        }),
      })

      if (!ttsResponse.ok) {
        throw new Error('Failed to generate speech')
      }

      // 5. Crear URL del audio
      const audioBlob = await ttsResponse.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // 6. Crear mensaje del agente
      const agentMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: cleanResponse,
        audioUrl: audioUrl,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, agentMessage])
      onMessage?.(agentMessage)

      // 7. Reproducir audio automáticamente
      await playMessage(agentMessage)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      onError?.(new Error(errorMessage))
      setStatus('idle')
      onStatusChange?.('idle')
    }
  }

  // Controles de grabación
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition()
    }
    
    if (recognitionRef.current) {
      setStatus('listening')
      onStatusChange?.('listening')
      setError(null)
      recognitionRef.current.start()
    }
  }, [initializeSpeechRecognition, onStatusChange])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setStatus('idle')
      onStatusChange?.('idle')
    }
  }, [onStatusChange])

  // Controles de audio
  const playMessage = async (message: VoiceMessage) => {
    if (!message.audioUrl || !audioPlayerRef.current) return

    try {
      setAudioState({ isPlaying: true })
      audioPlayerRef.current.src = message.audioUrl
      await audioPlayerRef.current.play()
      
      audioPlayerRef.current.onended = () => {
        setAudioState({ isPlaying: false })
        setStatus('idle')
        onStatusChange?.('idle')
      }
    } catch (err) {
      setError('Failed to play audio')
      setAudioState({ isPlaying: false })
      setStatus('idle')
      onStatusChange?.('idle')
    }
  }

  const pauseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      setAudioState({ isPlaying: false })
    }
  }

  // Funciones de control
  const startConversation = async () => {
    setMessages([])
    setError(null)
    setStatus('idle')
  }

  const clearConversation = () => {
    setMessages([])
    setTranscript('')
    setError(null)
    setStatus('idle')
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.src = ''
    }
  }

  return {
    messages,
    status,
    transcript,
    audioState,
    error,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
    startConversation,
    clearConversation,
    playMessage,
    pauseAudio,
    audioPlayerRef,
  }
}
