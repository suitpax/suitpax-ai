"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useChatContainer } from "./chat-container"

export const ScrollButton: React.FC = () => {
  const { scrollToBottom, isAtBottom } = useChatContainer()

  if (isAtBottom) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={scrollToBottom}
      className="fixed bottom-20 right-4 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white"
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  )
}