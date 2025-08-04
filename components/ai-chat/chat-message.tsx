import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
        className={`${message.role === "user" ? "bg-white/10 text-white rounded-lg rounded-tr-none border border-white/20" : "bg-black/80 border border-white/10 text-white rounded-xl rounded-tl-none"} max-w-[80%] p-4 backdrop-blur-sm`}
      >
        {message.role === "assistant" ? (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:font-medium prose-headings:tracking-tighter prose-headings:text-white prose-h1:text-lg prose-h1:mb-3 prose-h2:text-base prose-h2:mb-2 prose-h3:text-sm prose-h3:mb-2 prose-p:text-sm prose-p:text-white/90 prose-p:leading-relaxed prose-p:mb-3 prose-ul:text-sm prose-ul:text-white/90 prose-ul:mb-3 prose-ol:text-sm prose-ol:text-white/90 prose-ol:mb-3 prose-li:text-white/90 prose-li:mb-1 prose-strong:text-white prose-strong:font-medium prose-code:bg-white/10 prose-code:text-white prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-3 prose-pre:overflow-x-auto prose-pre:mb-3 prose-blockquote:border-l-2 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-white/80 prose-blockquote:mb-3 prose-table:border prose-table:border-white/20 prose-table:rounded-lg prose-table:mb-3 prose-thead:bg-white/5 prose-th:border prose-th:border-white/20 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:font-medium prose-th:text-white prose-td:border prose-td:border-white/20 prose-td:px-3 prose-td:py-2 prose-td:text-xs prose-td:text-white/90 prose-a:text-gray-200 prose-a:underline hover:prose-a:text-white">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headers con el estilo de Suitpax
                h1: ({ children }) => (
                  <h1 className="text-lg font-medium tracking-tighter text-white mb-3 leading-none">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-medium tracking-tighter text-white mb-2 mt-4 leading-none">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-medium tracking-tighter text-white mb-2 mt-3 leading-none">{children}</h3>
                ),
                // Párrafos con el estilo correcto
                p: ({ children }) => (
                  <p className="text-sm text-white/90 leading-relaxed mb-3 font-light">{children}</p>
                ),
                // Listas con mejor espaciado
                ul: ({ children }) => (
                  <ul className="text-sm text-white/90 space-y-1 mb-3 ml-4 list-disc">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-sm text-white/90 space-y-1 mb-3 ml-4 list-decimal">{children}</ol>
                ),
                li: ({ children }) => <li className="text-sm text-white/90 font-light">{children}</li>,
                // Texto en negrita
                strong: ({ children }) => <strong className="font-medium text-white">{children}</strong>,
                // Código inline
                code: ({ children }) => (
                  <code className="bg-white/10 text-white px-1.5 py-0.5 rounded text-xs font-mono border border-white/20">
                    {children}
                  </code>
                ),
                // Bloques de código
                pre: ({ children }) => (
                  <pre className="bg-white/5 border border-white/10 rounded-lg p-4 overflow-x-auto mb-4 text-xs">
                    {children}
                  </pre>
                ),
                // Citas
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-200 pl-4 italic text-white/80 mb-3 bg-white/5 py-2 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                // Tablas con estilo Suitpax
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4 rounded-lg border border-white/20">
                    <table className="min-w-full">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-white/10">{children}</thead>,
                th: ({ children }) => (
                  <th className="border-b border-white/20 px-4 py-3 text-left text-xs font-medium text-white tracking-wider">
                    {children}
                  </th>
                ),
                tbody: ({ children }) => <tbody className="bg-white/5">{children}</tbody>,
                tr: ({ children }) => <tr className="hover:bg-white/5 transition-colors">{children}</tr>,
                td: ({ children }) => (
                  <td className="border-b border-white/10 px-4 py-3 text-xs text-white/90 font-light">{children}</td>
                ),
                // Enlaces
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-gray-200 hover:text-white underline underline-offset-2 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // Separadores
                hr: () => <hr className="border-white/20 my-4" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed font-light">{message.content}</p>
        )}
        {message.timestamp && (
          <p className="text-xs text-white/50 mt-3 font-medium">
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
