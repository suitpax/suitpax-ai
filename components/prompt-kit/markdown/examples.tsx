"use client"

import { Markdown } from "@/components/prompt-kit/markdown"

export function MarkdownBasic() {
  const markdownContent = `\n# Markdown Example\n\nThis is a **bold text** and this is an *italic text*.\n\n## Lists\n\n### Unordered List\n- Item 1\n- Item 2\n- Item 3\n\n### Ordered List\n1. First item\n2. Second item\n3. Third item\n\n## Links and Images\n\n[Visit Prompt Kit](https://prompt-kit.com)\n\n## Code\n\nInline \`code\` example.\n\n\`\`\`javascript\n// Code block example\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\`\`\`\n`

  return (
    <div className="w-full max-w-3xl">
      <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs">
        {markdownContent}
      </Markdown>
    </div>
  )
}

export default MarkdownBasic

