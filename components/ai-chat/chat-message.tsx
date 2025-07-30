import Image from "next/image"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "assistant" && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-white/20">
          <Image
            src="/agents/agent-15.png"
            alt="Zia AI Assistant"
            width={32}
            height={32}
            className="h-8 w-8 object-cover"
          />
        </div>
      )}
      <div
        className={`${
          message.role === "user"
            ? "bg-white/10 text-white rounded-lg rounded-tr-none border border-white/20"
            : "bg-black/80 border border-white/10 text-white rounded-xl rounded-tl-none"
        } max-w-[80%] p-3 backdrop-blur-sm`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {message.timestamp && (
          <p className="text-xs text-white/50 mt-1">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
      {message.role === "user" && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/20">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-xs font-medium text-white">U</span>
          </div>
        </div>
      )}
    </div>
  )
}
