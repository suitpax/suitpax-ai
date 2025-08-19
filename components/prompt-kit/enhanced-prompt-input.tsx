"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Paperclip, Send, Mic, MicOff, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface EnhancedPromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  placeholder?: string
  maxLength?: number
  showWordCount?: boolean
  enableVoice?: boolean
  enableAttachments?: boolean
  className?: string
}

export function EnhancedPromptInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Ask Suitpax AI anything...",
  maxLength = 4000,
  showWordCount = true,
  enableVoice = true,
  enableAttachments = true,
  className,
}: EnhancedPromptInputProps) {
  const [isRecording, setIsRecording] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length
  const charCount = value.length
  const isNearLimit = charCount > maxLength * 0.8

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSubmit()
      }
    }
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(200, textareaRef.current.scrollHeight)}px`
    }
  }, [value])

  return (
    <motion.div
      className={cn(
        "relative w-full border rounded-2xl bg-black/60 border-white/10 backdrop-blur-md shadow-sm transition-all duration-200",
        isFocused && "ring-2 ring-white/20 border-white/30 shadow-md",
        isLoading && "opacity-75",
        className,
      )}
      initial={{ scale: 0.98 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading}
          maxLength={maxLength}
          rows={1}
          className="w-full resize-none bg-transparent text-white placeholder:text-white/50 focus:outline-none disabled:cursor-not-allowed text-sm leading-relaxed min-h-[24px] max-h-[200px] overflow-y-auto"
        />

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              {enableAttachments && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              )}

              {enableVoice && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceToggle}
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg transition-colors",
                    isRecording
                      ? "text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"
                      : "text-white/60 hover:text-white hover:bg-white/10",
                  )}
                  disabled={isLoading}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                disabled={isLoading}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {showWordCount && (
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>{wordCount} words</span>
                  <span className={cn("transition-colors", isNearLimit && "text-orange-400")}>
                    {charCount}/{maxLength}
                  </span>
                </div>
              )}

              <Button
                type="button"
                onClick={onSubmit}
                disabled={!value.trim() || isLoading || charCount > maxLength}
                size="sm"
                className="h-8 px-3 bg-white/90 hover:bg-white text-black rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
      </div>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2"
          >
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-700 font-medium">Recording...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
