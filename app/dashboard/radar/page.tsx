"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { fetchNews, formatNewsForAI } from "@/lib/web-search"
import { Loader2, ArrowRight } from "lucide-react"

interface ResultItem {
  title: string
  url: string
  description: string
  outlet?: string
  image?: string
  published?: string
}

export default function RadarPage() {
  const [query, setQuery] = useState("")
  const [period, setPeriod] = useState<"d1" | "d7">("d1")
  const [activeTab, setActiveTab] = useState("news")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ResultItem[]>([])
  const [aiSummary, setAiSummary] = useState<string | null>(null)

  const periodLabel = period === "d1" ? "Últimas 24h" : "Semana"

  const placeholder = "Ruta/destino/aerolínea (ej. MAD→SFO, Lufthansa, Heathrow)"

  const runSearch = async () => {
    setLoading(true)
    setAiSummary(null)
    try {
      const q = query?.trim() || "airline strikes business travel"
      const res = await fetchNews(q, 12, period)
      setResults(res.results as any)
    } finally {
      setLoading(false)
    }
  }

  const handleAiSummary = async () => {
    setAiSummary("Pensando…")
    try {
      const formatted = formatNewsForAI(results as any)
      const response = await fetch("/api/ai-core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Resume y categoriza estas noticias para un travel manager. Devuelve bullets y lista de acciones. Cita fuentes con [n] -> URL.\n\n${formatted}`,
          history: [],
          includeReasoning: false,
        }),
      }).then((r) => r.json())
      setAiSummary(response.response || "")
    } catch {
      setAiSummary("No se pudo generar el resumen.")
    }
  }

  useEffect(() => {
    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none mb-2">Radar</h1>
            <p className="text-gray-600 font-light">Travel Intel Radar: titulares y alertas por ruta/destino/aerolínea</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={period === "d1" ? "default" : "outline"} size="sm" onClick={() => setPeriod("d1")}>Últimas 24h</Button>
            <Button variant={period === "d7" ? "default" : "outline"} size="sm" onClick={() => setPeriod("d7")}>Semana</Button>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
        <Button onClick={runSearch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Buscar <ArrowRight className="h-4 w-4 ml-1" /></>}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100">
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="advisories">Advisories</TabsTrigger>
          <TabsTrigger value="airlines">Aerolíneas</TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="mt-4">
          <div className="space-y-3">
            {results.length === 0 && !loading && (
              <div className="text-sm text-gray-600">Sin resultados aún.</div>
            )}
            {results.map((r, i) => (
              <div key={`${r.url}-${i}`} className="flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image} alt={r.outlet || r.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[10px] text-gray-500">{new URL(r.url).hostname.replace("www.", "")}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-900 hover:underline">
                      {r.title}
                    </a>
                    {r.outlet && <Badge variant="secondary" className="text-[10px]">{r.outlet}</Badge>}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">{r.description}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <a href={r.url} target="_blank" className="text-xs text-gray-600 underline">Abrir</a>
                  <button className="text-xs text-gray-600 underline" onClick={() => navigator.clipboard.writeText(r.url)}>Copiar fuente</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleAiSummary} disabled={results.length === 0}>
              Resumen IA
            </Button>
          </div>
          {aiSummary && (
            <div className="mt-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap">
              {aiSummary}
            </div>
          )}
        </TabsContent>
        <TabsContent value="advisories" className="mt-4">
          <div className="text-sm text-gray-600">Próximamente: alertas oficiales (visados, seguridad, aeropuertos).</div>
        </TabsContent>
        <TabsContent value="airlines" className="mt-4">
          <div className="text-sm text-gray-600">Próximamente: panel por aerolínea con incidencias y equipaje.</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
