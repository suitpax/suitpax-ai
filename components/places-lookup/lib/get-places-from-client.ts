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
  let primary: any[] = []
  try {
    const json = await res.json()
    primary = Array.isArray(json?.data) ? json.data : []
  } catch {}

  // Complement with airports by city code if user typed a city code like LON
  let airports: any[] = []
  try {
    const isCityIata = /^[a-zA-Z]{3}$/.test(normalized)
    if (isCityIata) {
      const ar = await fetch(new URL(`/api/flights/duffel/airports?city_iata=${normalized.toUpperCase()}`, window.location.origin).toString())
      const j = await ar.json()
      airports = Array.isArray(j?.data) ? j.data : []
    }
  } catch {}

  return [...primary, ...airports]
}

