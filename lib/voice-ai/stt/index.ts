export type STTEngine = "webspeech" | "server"

export interface STTOptions { engine: STTEngine; language: string }

export function startSTT(opts: STTOptions, onResult: (text: string, isFinal: boolean) => void, onEnd: (final: string) => void, onError: (err: any) => void) {
  if (opts.engine === "webspeech" && typeof window !== "undefined") {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) return onError("No Web Speech API")
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = opts.language
    let finalText = ""
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          finalText += transcript
          onResult(transcript, true)
        } else {
          onResult(transcript, false)
        }
      }
    }
    rec.onerror = onError
    rec.onend = () => onEnd(finalText)
    rec.start()
    return () => rec.stop()
  }
  onError("Unsupported STT engine")
  return () => {}
}