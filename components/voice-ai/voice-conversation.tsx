"use client"

import { VoiceMessage, useVoice } from "@/hooks/use-voice"
import { Button } from "@/components/ui/button"

export default function VoiceConversation({ voiceId }: { voiceId?: string }) {
  const { messages, transcript, status, startListening, stopListening, clearConversation, sendTranscript, play, pause } = useVoice()
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-gray-200 bg-white/70 p-3 min-h-[160px]">
        <div className="space-y-2">
          {messages.map((m: VoiceMessage) => (
            <div key={m.id} className={`text-sm ${m.role === 'user' ? 'text-gray-900' : 'text-gray-700'}`}>{m.role === 'user' ? 'You: ' : 'Agent: '}{m.text}</div>
          ))}
          {status === 'listening' && <div className="text-xs text-gray-500">Listening… {transcript}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status !== 'listening' ? (
          <Button className="rounded-2xl" onClick={startListening}>Start</Button>
        ) : (
          <Button className="rounded-2xl" onClick={() => stopListening()}>Stop</Button>
        )}
        <Button variant="outline" className="rounded-2xl" onClick={() => sendTranscript(voiceId)} disabled={!transcript.trim() && status !== 'idle'}>Send</Button>
        <Button variant="outline" className="rounded-2xl" onClick={clearConversation}>Clear</Button>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-2xl" onClick={play}>Play</Button>
          <Button variant="outline" size="sm" className="rounded-2xl" onClick={pause}>Pause</Button>
        </div>
      </div>
    </div>
  )
}

