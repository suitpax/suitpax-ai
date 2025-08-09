"use client"

import { motion } from "framer-motion"
import { Bot, User } from 'lucide-react'
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const [avatarSrc, setAvatarSrc] = useState("/agents/agent-12.png")

  return (
    <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}> 
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center">
          <Image src={avatarSrc} alt="Suitpax AI" width={20} height={20} onError={() => setAvatarSrc("/agents/agent-11.png")} />
        </div>
      )}
      <div
        className={cn(
          "max-w-2xl rounded-2xl p-4",
          isUser
            ? "bg-gray-900 text-white rounded-br-lg"
            : "bg-white text-gray-800 border border-gray-100 rounded-bl-lg"
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2" {...props} />,
            table: ({node, ...props}) => <table className="w-full border-collapse border border-gray-200 my-4" {...props} />,
            th: ({node, ...props}) => <th className="border border-gray-200 px-4 py-2 text-left bg-gray-50 font-medium" {...props} />,
            td: ({node, ...props}) => <td className="border border-gray-200 px-4 py-2" {...props} />,
            img: ({node, ...props}) => <img className="rounded-lg my-2 max-w-full h-auto" {...props} />,
            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-600" />
        </div>
      )}
    </div>
  )
}

export function ChatLoadingIndicator() {
  const [avatarSrc, setAvatarSrc] = useState("/agents/agent-12.png")
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center">
        <Image src={avatarSrc} alt="Suitpax AI" width={20} height={20} onError={() => setAvatarSrc("/agents/agent-11.png")} />
      </div>
      <div className="max-w-2xl rounded-2xl p-4 bg-white text-gray-800 border border-gray-100 rounded-bl-lg">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
