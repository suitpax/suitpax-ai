"use client"

import { useState } from "react"
import {
  PromptInput,
  PromptInputActions,
  PromptInputAction,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { PiMicrophoneBold, PiPaperPlaneRightBold } from "react-icons/pi"

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (message.trim()) {
      onSend(message.trim())
      setMessage("")
    }
  }

  return (
    <PromptInput>
      <PromptInputTextarea
        placeholder="Escribe tu mensaje para Suitpax AI..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
      />
      <PromptInputActions>
        <PromptInputAction tooltip="Talk (Coming soon..)">
          <Button variant="ghost" size="icon">
            <PiMicrophoneBold className="w-4 h-4" />
          </Button>
        </PromptInputAction>
        <PromptInputAction tooltip="Enviar">
          <Button onClick={handleSubmit} variant="default" size="icon">
            <PiPaperPlaneRightBold className="w-4 h-4" />
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  )
}