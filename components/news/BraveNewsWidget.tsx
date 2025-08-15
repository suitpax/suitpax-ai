"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { fetchNews, type BraveFreshness, type NewsResult } from "@/lib/web-search"
import { Loader2 } from "lucide-react"

interface BraveNewsWidgetProps {
	defaultQuery?: string
	defaultFreshness?: BraveFreshness
	maxItems?: number
	title?: string
}

export default function BraveNewsWidget({
	defaultQuery = "business travel",
	defaultFreshness = "d7",
	maxItems = 6,
	title = "Brave News",
}: BraveNewsWidgetProps) {
	const [query, setQuery] = useState(defaultQuery)
	const [freshness, setFreshness] = useState<BraveFreshness>(defaultFreshness)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [items, setItems] = useState<NewsResult[]>([])

	const placeholder = useMemo(
		() => "Tema, aerolínea o destino (ej. airline strikes, MAD→SFO)",
		[],
	)

	const run = async () => {
		setLoading(true)
		setError(null)
		try {
			const q = query.trim() || defaultQuery
			const res = await fetchNews(q, maxItems, freshness)
			setItems(res.results)
		} catch (e) {
			setError("No se pudieron cargar las noticias.")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void run()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [freshness])

	return (
		<Card className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-medium tracking-tighter text-gray-900">{title}</CardTitle>
					<div className="flex items-center gap-2">
						<Button size="sm" variant={freshness === "d1" ? "default" : "outline"} onClick={() => setFreshness("d1")}>
							24h
						</Button>
						<Button size="sm" variant={freshness === "d7" ? "default" : "outline"} onClick={() => setFreshness("d7")}>
							Semana
						</Button>
						<Button size="sm" variant={freshness === "m1" ? "default" : "outline"} onClick={() => setFreshness("m1")}>
							Mes
						</Button>
					</div>
				</div>
				<div className="mt-2 flex items-center gap-2">
					<Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
					<Button size="sm" onClick={run} disabled={loading}>
						{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="pt-0 space-y-2">
				{error && (
					<div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded-xl">{error}</div>
				)}
				{!error && items.length === 0 && !loading && (
					<div className="text-xs text-gray-600">Sin resultados para esta búsqueda.</div>
				)}
				{items.slice(0, maxItems).map((r, i) => (
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
								{r.outlet && (
									<Badge variant="outline" className="text-[9px]">
										{r.outlet}
									</Badge>
								)}
							</div>
							<div className="text-xs text-gray-600 line-clamp-2">{r.description}</div>
							<div className="mt-1 flex items-center gap-3 text-[11px] text-gray-600">
								<a className="underline" href={r.url} target="_blank" rel="noreferrer">
									Abrir
								</a>
								<button onClick={() => navigator.clipboard.writeText(r.url)} className="underline">
									Copiar fuente
								</button>
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
