export async function getPlacesFromClient(query: string) {
  const res = await fetch(`/api/flights/duffel/places/suggestions?query=${encodeURIComponent(query)}`)
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json?.data) ? json.data : []
}

