"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import CodeBlock from "@/components/prompt-kit/code-block"

interface MarkdownProps {
  content: string
  className?: string
}

export default function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl font-semibold mb-3" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-gray-300 pl-3 italic text-gray-700 my-3" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-gray-900 underline underline-offset-2 decoration-gray-400 hover:decoration-black"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          table: ({ node, ...props }) => <table className="w-full border-collapse border border-gray-200 my-4" {...props} />,
          th: ({ node, ...props }) => (
            <th className="border border-gray-200 px-4 py-2 text-left bg-gray-50 font-medium" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border border-gray-200 px-4 py-2" {...props} />,
          img: ({ node, ...props }) => <img className="rounded-lg my-2 max-w-full h-auto" {...props} />,
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            if (inline) {
              return (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px] text-gray-900" {...props}>
                  {children}
                </code>
              )
            }
            const lang = match ? match[0] : undefined
            const content = String(children).replace(/\n$/, "")
            return <CodeBlock code={content} language={lang} />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
