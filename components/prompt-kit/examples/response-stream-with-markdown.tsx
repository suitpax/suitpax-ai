"use client"

import { Markdown } from "@/components/prompt-kit/markdown"
import { useTextStream } from "@/components/prompt-kit/response-stream"
import { useEffect } from "react"

export function ResponseStreamWithMarkdown() {
  const markdownText = `## Streaming Markdown\n\nThis example shows how to combine **useTextStream** with *Markdown* rendering.\n\n- The text is processed by useTextStream\n- Then rendered directly with Markdown\n- Perfect for AI responses with formatting\n\n\`\`\`js\n// Code blocks work too!\nfunction example() {\n  return \"Hello world\";\n}\n\`\`\`\n`

  const { displayedText, startStreaming } = useTextStream({ textStream: markdownText, mode: "typewriter", speed: 30 })
  useEffect(() => { startStreaming() }, [startStreaming])

  return (
    <div className="w-full min-w-full">
      <Markdown className="prose prose-sm dark:prose-invert prose-h2:mt-0! prose-h2:scroll-m-0!">
        {displayedText}
      </Markdown>
    </div>
  )
}

export default ResponseStreamWithMarkdown

