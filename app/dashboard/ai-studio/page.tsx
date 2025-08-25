"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Notebook from "@/components/ai-studio/notebook"
import PodcastStudio from "@/components/ai-studio/podcast-studio"
import DocSummarizer from "@/components/ai-studio/doc-summarizer"

export default function AIStudioPage() {
  const [tab, setTab] = useState<'notebook'|'podcast'|'docs'>('notebook')
  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none">AI Studio</h1>
          <p className="text-gray-600 font-light">Notebook, Podcast generation, and Document summaries with voice</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-2">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
            <button onClick={() => setTab('notebook')} className={`px-3 py-1.5 rounded-lg text-sm ${tab==='notebook' ? 'bg-white shadow-sm' : ''}`}>Notebook</button>
            <button onClick={() => setTab('podcast')} className={`px-3 py-1.5 rounded-lg text-sm ${tab==='podcast' ? 'bg-white shadow-sm' : ''}`}>Podcast</button>
            <button onClick={() => setTab('docs')} className={`px-3 py-1.5 rounded-lg text-sm ${tab==='docs' ? 'bg-white shadow-sm' : ''}`}>Docs</button>
          </div>
        </CardContent>
      </Card>

      {tab === 'notebook' && <Notebook />}
      {tab === 'podcast' && <PodcastStudio />}
      {tab === 'docs' && <DocSummarizer />}
    </div>
  )
}

