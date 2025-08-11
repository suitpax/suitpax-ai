"use client"

import { Source, SourceContent, SourceTrigger } from "@/components/prompt-kit/source"

export function SourceBasic() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Source href="https://ibelick.com">
        <SourceTrigger showFavicon faviconUrl="https://cdn.brandfetch.io/ibelick.com/icon" />
        <SourceContent
          title="Ibelick"
          description="Julien Thibeaut (@Ibelick). Design Engineer passionate about crafting beautiful, functional interfaces and tools."
        />
      </Source>
      <Source href="https://www.google.com">
        <SourceTrigger showFavicon faviconUrl="https://cdn.brandfetch.io/google.com/icon" />
        <SourceContent
          title="Google"
          description="Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for."
        />
      </Source>
      <Source href="https://www.figma.com">
        <SourceTrigger showFavicon faviconUrl="https://cdn.brandfetch.io/figma.com/icon" />
        <SourceContent
          title="Figma"
          description="Figma is the leading collaborative design tool for building meaningful products. Seamlessly design, prototype, develop, and collect feedback in a single platform."
        />
      </Source>
      <Source href="https://github.com/ibelick/prompt-kit">
        <SourceTrigger showFavicon faviconUrl="https://cdn.brandfetch.io/github.com/icon" />
        <SourceContent
          title="Core building blocks for AI apps. High-quality, accessible, and customizable components for AI interfaces."
          description="Customizable, high-quality components for AI applications. Build chat experiences, AI agents, autonomous assistants, and more, quickly and beautifully."
        />
      </Source>
      <Source href="https://www.wikipedia.org">
        <SourceTrigger showFavicon faviconUrl="https://cdn.brandfetch.io/wikipedia.org/icon" />
        <SourceContent
          title="Wikipedia"
          description="Welcome to Wikipedia, the free encyclopedia that anyone can edit."
        />
      </Source>
    </div>
  )
}

export default SourceBasic