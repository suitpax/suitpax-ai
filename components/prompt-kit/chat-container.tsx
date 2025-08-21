"use client"

import { cn } from "@/lib/utils"

export function ChatContainerRoot({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        "bg-white",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ChatContainerContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "h-full w-full overflow-y-auto",
        "[scrollbar-width:thin] [scrollbar-color:#9ca3af_transparent]",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full",
        className,
      )}
    >
      {children}
    </div>
  )}

export function ChatContainerFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur",
        "border-t border-gray-200 px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  )
}

export default ChatContainerRoot

