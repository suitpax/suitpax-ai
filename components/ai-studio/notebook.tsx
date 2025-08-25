"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Cell { id: string; type: 'markdown'|'ai'; content: string; output?: string }

export default function Notebook() {
  const [cells, setCells] = useState<Cell[]>([ { id: '1', type: 'markdown', content: '# Idea: Trip plan to London' } ])
  const runCell = async (cell: Cell) => {
    if (cell.type !== 'ai') return
    const res = await fetch('/api/notebook/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: cell.content }) })
    const data = await res.json().catch(() => ({}))
    setCells(prev => prev.map(c => c.id===cell.id ? { ...c, output: data.text || data.response || 'No output' } : c))
  }
  const addCell = (type: Cell['type']) => {
    const id = `${Date.now()}`
    setCells(prev => [...prev, { id, type, content: '' }])
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button className="rounded-2xl" onClick={() => addCell('markdown')}>Add Markdown</Button>
        <Button variant="outline" className="rounded-2xl" onClick={() => addCell('ai')}>Add AI Cell</Button>
      </div>
      <div className="space-y-3">
        {cells.map(cell => (
          <Card key={cell.id}><CardContent className="p-3 space-y-2">
            <div className="text-xs text-gray-500">{cell.type.toUpperCase()} CELL</div>
            <textarea value={cell.content} onChange={e => setCells(prev => prev.map(c => c.id===cell.id ? { ...c, content: e.target.value } : c))} className="w-full min-h-[120px] rounded-xl border-gray-300" />
            {cell.type==='ai' && <Button size="sm" className="rounded-xl" onClick={() => runCell(cell)}>Run</Button>}
            {cell.output && <div className="text-sm text-gray-800 whitespace-pre-wrap border-t pt-2">{cell.output}</div>}
          </CardContent></Card>
        ))}
      </div>
    </div>
  )
}

