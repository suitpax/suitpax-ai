"use client"

import { useState } from "react"

export function MCPRemoteServerList() {
  const [url, setUrl] = useState("")
  const [tools, setTools] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTools = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/mcp/remote/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serverUrl: url }) })
      const data = await res.json()
      setTools(data.tools || [])
    } finally {
      setLoading(false)
    }
  }

  const fetchResources = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/mcp/remote/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serverUrl: url }) })
      const data = await res.json()
      setResources(data.resources || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-xl bg-white">
      <div className="flex gap-2 items-center">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="wss://your-remote-mcp" className="border rounded px-2 py-1 text-sm flex-1" />
        <button onClick={fetchTools} disabled={!url || loading} className="px-2 py-1 text-sm border rounded">Tools</button>
        <button onClick={fetchResources} disabled={!url || loading} className="px-2 py-1 text-sm border rounded">Resources</button>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <h4 className="text-sm font-medium mb-2">Tools</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {tools.map((t, i) => (
              <li key={i} className="border rounded px-2 py-1">{t.name} — {t.description}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Resources</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {resources.map((r, i) => (
              <li key={i} className="border rounded px-2 py-1">{r.name || r.uri}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}