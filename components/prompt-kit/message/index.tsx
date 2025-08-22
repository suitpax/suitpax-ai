"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type MessageProps = React.HTMLAttributes<HTMLDivElement>

export function Message({ className, children, ...rest }: MessageProps) {
  return (
    <div className={cn("flex items-start gap-3", className)} {...rest}>
      {children}
    </div>
  )
}

export type MessageAvatarProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string
}

export function MessageAvatar({ className, src, alt, fallback, ...rest }: MessageAvatarProps) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={cn("h-8 w-8 rounded-full object-cover", className)} {...rest} />
  ) : (
    <div className={cn("h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-medium", className)}>
      {fallback?.slice(0, 2) || "AI"}
    </div>
  )
}

export type MessageContentProps = React.HTMLAttributes<HTMLDivElement> & {
  markdown?: boolean
}

export function MessageContent({ className, markdown, children, ...rest }: MessageContentProps) {
  return (
    <div
      className={cn(
        "max-w-prose rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-900 border border-gray-200",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export type MessageActionsProps = React.HTMLAttributes<HTMLDivElement>

export function MessageActions({ className, children, ...rest }: MessageActionsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} {...rest}>
      {children}
    </div>
  )
}

export type MessageActionProps = React.HTMLAttributes<HTMLDivElement> & {
  tooltip?: string
}

export function MessageAction({ className, tooltip, children, ...rest }: MessageActionProps) {
  return (
    <div title={tooltip} className={cn("inline-flex items-center justify-center", className)} {...rest}>
      {children}
    </div>
  )
}

export default Message

