"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Paperclip, Send, Mic, MicOff, Settings, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { UnifiedDialog } from "@/components/ui/unified-dialog"

export const PromptInput = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (val: string) => void
    isLoading?: boolean
    onSubmit?: () => void
    placeholder?: string
    maxLength?: number
    showWordCount?: boolean
    enableVoice?: boolean
    enableAttachments?: boolean
    showControls?: boolean
  }
>(
  (
    {
      className,
      children,
      value = "",
      onValueChange,
      isLoading = false,
      onSubmit,
      placeholder = "Ask Suitpax AI anything...",
      maxLength = 4000,
      showWordCount = true,
      enableVoice = true,
      enableAttachments = true,
      showControls = true,
      ...props
    },
    ref,
  ) => {
    const [isRecording, setIsRecording] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [dialogType, setDialogType] = React.useState<"connections" | "models" | "agents">("connections")
    const [selectedModel, setSelectedModel] = React.useState("Suitpax AI 1.0")
    const [selectedAgent, setSelectedAgent] = React.useState("Agent 40")

    const wordCount = value.trim().split(/\s+/).filter(Boolean).length
    const charCount = value.length
    const isNearLimit = charCount > maxLength * 0.8

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (value.trim() && !isLoading) {
          onSubmit?.()
        }
      }
    }

    const handleVoiceToggle = () => {
      setIsRecording(!isRecording)
    }

    const openConnectionsDialog = () => {
      setDialogType("connections")
      setDialogOpen(true)
    }

    const openModelsDialog = () => {
      setDialogType("models")
      setDialogOpen(true)
    }

    const openAgentsDialog = () => {
      setDialogType("agents")
      setDialogOpen(true)
    }

    // If children are provided, use legacy composition API
    if (children) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex w-full flex-col gap-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 p-3 sm:p-4 shadow-sm",
            "transition-all supports-[backdrop-filter]:backdrop-blur focus-within:shadow-md focus-within:ring-1 focus-within:ring-gray-300",
            className,
          )}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child
            if ((child as any).type?.displayName === "PromptInputTextarea") {
              return React.cloneElement(child as any, {
                value,
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onValueChange?.(e.target.value),
                disabled: (child as any).props?.disabled ?? isLoading,
                placeholder,
              })
            }
            return child
          })}
        </div>
      )
    }

    // Enhanced standalone component
    return (
      <>
        <motion.div
          ref={ref}
          className={cn(
            "relative w-full border border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200",
            isFocused && "ring-2 ring-blue-500/20 border-blue-300 shadow-md",
            isLoading && "opacity-75",
            className,
          )}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {showControls && (
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={openModelsDialog}
                >
                  {selectedModel}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={openAgentsDialog}
                >
                  {selectedAgent}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openConnectionsDialog}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex flex-col p-4">
            <textarea
              value={value}
              onChange={(e) => onValueChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isLoading}
              maxLength={maxLength}
              rows={1}
              className="w-full resize-none bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed text-sm leading-relaxed min-h-[24px] max-h-[200px] overflow-y-auto"
              onInput={(e) => {
                const el = e.currentTarget
                el.style.height = "auto"
                el.style.height = `${Math.min(200, el.scrollHeight)}px`
              }}
            />

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {enableAttachments && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
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
                        ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                    )}
                    disabled={isLoading}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {showWordCount && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{wordCount} words</span>
                    <span className={cn("transition-colors", isNearLimit && "text-orange-500")}>
                      {charCount}/{maxLength}
                    </span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={!value.trim() || isLoading || charCount > maxLength}
                  size="sm"
                  className="h-8 px-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Settings className="h-4 w-4" />
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

        {showControls && (
          <UnifiedDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            type={dialogType}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        )}
      </>
    )
  },
)
PromptInput.displayName = "PromptInput"

export const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onInput, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={2}
    onInput={(e) => {
      const el = e.currentTarget
      el.style.height = "auto"
      el.style.height = `${Math.min(320, el.scrollHeight)}px`
      onInput?.(e)
    }}
    className={cn(
      "w-full resize-none bg-transparent text-sm sm:text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "leading-relaxed max-h-80 overflow-y-auto no-scrollbar",
      className,
    )}
    {...props}
  />
))
PromptInputTextarea.displayName = "PromptInputTextarea"

export const PromptInputActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between gap-2", className)} {...props} />
  ),
)
PromptInputActions.displayName = "PromptInputActions"

export const PromptInputAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tooltip?: string }
>(({ className, tooltip, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center space-x-1", className)} title={tooltip} {...props}>
    {children}
  </div>
))
PromptInputAction.displayName = "PromptInputAction"
