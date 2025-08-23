"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import React from "react"
import { useChatContainer } from "./chat-container"

export type ScrollButtonProps = {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  threshold?: number
} & React.ComponentProps<typeof Button>

export function ScrollButton({
  className,
  variant = "default",
  size = "sm",
  threshold = 100,
  children,
  onClick,
  ...props
}: ScrollButtonProps) {
  const { isScrolledToBottom, scrollToBottom } = useChatContainer()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    scrollToBottom()
    onClick?.(event)
  }

  // No mostrar el botón si ya estamos en el fondo
  if (isScrolledToBottom) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "fixed bottom-20 right-4 z-50 rounded-full shadow-lg transition-all duration-200 ease-in-out",
        "hover:scale-105 active:scale-95",
        "bg-white hover:bg-gray-50 border border-gray-200",
        "text-gray-700 hover:text-gray-900",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children || <ChevronDown className="h-4 w-4" />}
    </Button>
  )
}

