// Global type declarations for Suitpax

// Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResult {
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

// Speech Synthesis API
interface SpeechSynthesisUtterance extends EventTarget {
  text: string
  lang: string
  voice: SpeechSynthesisVoice | null
  volume: number
  rate: number
  pitch: number
  onstart: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null
  onend: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null
  onerror: ((this: SpeechSynthesisUtterance, ev: Event) => any) | null
}

interface SpeechSynthesisVoice {
  readonly name: string
  readonly lang: string
  readonly localService: boolean
  readonly default: boolean
}

// Intercom
interface Window {
  // Speech Recognition
  SpeechRecognition: {
    new (): SpeechRecognition
  }
  webkitSpeechRecognition: {
    new (): SpeechRecognition
  }
  
  // Speech Synthesis
  speechSynthesis: SpeechSynthesis
  SpeechSynthesisUtterance: {
    new (text?: string): SpeechSynthesisUtterance
  }
  
  // Intercom
  Intercom?: any
  
  // File System API (for artifacts)
  fs?: {
    readFile: (path: string, options?: { encoding?: string }) => Promise<any>
  }
}

// Module declarations for packages without types
declare module "@intercom/messenger-js-sdk" {
  const Intercom: any
  export default Intercom
}

declare module "elevenlabs" {
  export class ElevenLabsApi {
    constructor(options: { apiKey: string })
    generate(options: any): Promise<ArrayBuffer>
    voices: {
      getAll(): Promise<{ voices: any[] }>
    }
  }
}