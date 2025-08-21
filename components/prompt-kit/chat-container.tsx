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

export default ChatContainerRoot

