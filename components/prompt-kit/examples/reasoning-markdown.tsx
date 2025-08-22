"use client"

import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/prompt-kit/reasoning"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const simulateMarkdownStream = async (
  setText: (text: string) => void,
  setIsStreaming: (streaming: boolean) => void,
) => {
  const reasoning = `# Solving: Square Root of 144\n\n## Step 1: Problem Analysis\nI need to find a number that, when **multiplied by itself**, equals 144.\n\n## Step 2: Testing Values\n- \`10² = 100\` ❌ (too small)\n- \`13² = 169\` ❌ (too large) \n- \`12² = 144\` ✅ (perfect!)\n\n## Step 3: Verification\n\`\`\`\n12 × 12 = 144 ✓\n\`\`\`\n\n> **Answer:** The square root of 144 is **12**.`

  setIsStreaming(true)
  setText("")
  for (let i = 0; i <= reasoning.length; i++) {
    setText(reasoning.slice(0, i))
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
  setIsStreaming(false)
}

export function ReasoningMarkdown() {
  const [reasoningText, setReasoningText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const handleGenerateReasoning = () => {
    simulateMarkdownStream(setReasoningText, setIsStreaming)
  }

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Button variant="outline" size="sm" onClick={handleGenerateReasoning} disabled={isStreaming}>
        {isStreaming ? "Thinking..." : "Generate Reasoning"}
      </Button>

      <Reasoning isStreaming={isStreaming}>
        <ReasoningTrigger>Show AI reasoning</ReasoningTrigger>
        <ReasoningContent markdown className="ml-2 border-l-2 border-l-slate-200 px-2 pb-1 dark:border-l-slate-700">
          {reasoningText}
        </ReasoningContent>
      </Reasoning>
    </div>
  )
}

export default ReasoningMarkdown

