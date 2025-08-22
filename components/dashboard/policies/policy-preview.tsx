"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function PolicyPreview({ content }: { content: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

