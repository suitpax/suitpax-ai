"use client"

import { useEffect, useMemo, useState } from "react"

function Field({ name, schema, value, onChange }: any) {
  const type = schema.type || (schema.enum ? "string" : "string")
  if (type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(name, e.target.checked)} />
        {name}
      </label>
    )
  }
  return (
    <div className="text-sm">
      <label className="block text-gray-600 mb-1">{name}</label>
      <input
        className="w-full border rounded px-2 py-1"
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={schema.description || name}
      />
    </div>
  )
}

export function MCPToolRunner() {
  const [serverUrl, setServerUrl] = useState<string>("")
  const [tools, setTools] = useState<any[]>([])
  const [selected, setSelected] = useState<string>("")
  const [args, setArgs] = useState<Record<string, any>>({})
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem("suitpax.mcp.serverUrl")
    if (saved) {
      setServerUrl(saved)
      fetch("/api/mcp/remote/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serverUrl: saved }) })
        .then((r) => r.json())
        .then((d) => setTools(d.tools || []))
    }
  }, [])

  const selectedTool = useMemo(() => tools.find((t) => t.name === selected), [tools, selected])
  const inputSchema = selectedTool?.inputSchema?.properties || {}

  const handleChange = (k: string, v: any) => setArgs((prev) => ({ ...prev, [k]: v }))

  const run = async () => {
    const res = await fetch("/api/mcp/remote/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverUrl, toolName: selected, args }),
    })
    const data = await res.json()
    setResult(data.result || data)
  }

  return (
    <div className="p-3 border rounded-xl bg-white">
      <div className="text-sm font-medium mb-2">Run MCP Tool</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <select className="w-full border rounded px-2 py-1 text-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">Select a tool</option>
            {tools.map((t, i) => (
              <option key={i} value={t.name}>{t.name}</option>
            ))}
          </select>
          <div className="mt-3 space-y-2">
            {Object.entries(inputSchema).map(([k, sch]: any) => (
              <Field key={k} name={k} schema={sch} value={args[k]} onChange={handleChange} />
            ))}
          </div>
          <button onClick={run} disabled={!selected} className="mt-3 px-3 py-1.5 text-sm border rounded">Run</button>
        </div>
        <pre className="bg-gray-50 border rounded p-2 text-xs overflow-auto max-h-64">{result ? JSON.stringify(result, null, 2) : "No result"}</pre>
      </div>
    </div>
  )
}