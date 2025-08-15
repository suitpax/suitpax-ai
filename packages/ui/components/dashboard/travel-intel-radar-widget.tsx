"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { fetchNews, formatNewsForAI, type BraveFreshness } from "@/lib/web-search"
import { Loader2 } from "lucide-react"

interface Item {
  title: string
  url: string
  description: string
  outlet?: string
  image?: string
  published?: string
}

export function TravelIntelRadarWidget() {
  const [period, setPeriod] = useState<BraveFreshness>("d1")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  const run = async () => {
    setLoading(true)
    setAiSummary(null)
    try {
      const q = query.trim() || "business travel airline strikes"
      const res = await fetchNews(q, 6, period)
      setItems(res.results as any)
    } finally {
      setLoading(false)
    }
  }

  const summarize = async () => {
    setAiSummary("Pensando…")
    try {
      const formatted = formatNewsForAI(items as any)
      const r = await fetch("/api/ai-core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Resume para dashboard ejecutivo estas noticias y su impacto en rutas/destinos/aerolíneas. Devuelve bullets y 3 acciones. Cita fuentes con [n] y URL.\n\n${formatted}`,
          history: [],
          includeReasoning: false,
        }),
      }).then((x) => x.json())
      setAiSummary(r.response || "")
    } catch {
      setAiSummary("No se pudo generar el resumen.")
    }
  }

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium tracking-tighter text-gray-900">Travel Intel Radar</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="xs" variant={period === "d1" ? "default" : "outline"} onClick={() => setPeriod("d1")}>24h</Button>
            <Button size="xs" variant={period === "d7" ? "default" : "outline"} onClick={() => setPeriod("d7")}>Semana</Button>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ruta/destino/aerolínea (ej. MAD→SFO)" />
          <Button size="sm" onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}</Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {items.slice(0, 5).map((r, i) => (
          <div key={`${r.url}-${i}`} className="flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
              {r.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image} alt={r.outlet || r.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[9px] text-gray-500">{new URL(r.url).hostname.replace("www.", "")}</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <a href={r.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-900 hover:underline">
                  {r.title}
                </a>
                {r.outlet && <Badge variant="secondary" className="text-[9px]">{r.outlet}</Badge>}
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">{r.description}</div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-600">
                <a className="underline" href={r.url} target="_blank" rel="noreferrer">Abrir</a>
                <button onClick={() => navigator.clipboard.writeText(r.url)} className="underline">Copiar fuente</button>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-1">
          <Button size="sm" variant="outline" onClick={summarize} disabled={items.length === 0}>Resumen IA</Button>
        </div>
        {aiSummary && (
          <div className="text-xs text-gray-800 p-2 rounded-xl bg-white/70 border border-gray-200 whitespace-pre-wrap">{aiSummary}</div>
        )}
      </CardContent>
    </Card>
  )
}