export async function getPlacesFromClient(query: string) {
  const synonyms: Record<string, string> = {
    praga: 'prague',
    londres: 'london',
    munich: 'munich',
    múnich: 'munich',
    roma: 'rome',
    florencia: 'florence',
    venecia: 'venice',
    sevilla: 'seville',
    oporto: 'porto',
    'nueva york': 'new york',
    estocolmo: 'stockholm',
    copenhague: 'copenhagen',
    varsovia: 'warsaw',
    cracovia: 'krakow',
  }
  const ql = (query || '').trim().toLowerCase()
  const normalized = synonyms[ql] || query
  const likelySpanish = /[áéíóúñ]/i.test(query) || Object.keys(synonyms).includes(ql)
  const url = new URL('/api/flights/duffel/places/suggestions', window.location.origin)
  url.searchParams.set('query', normalized)
  if (likelySpanish) url.searchParams.set('locale', 'es-ES')
  const res = await fetch(url.toString())
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json?.data) ? json.data : []
}

