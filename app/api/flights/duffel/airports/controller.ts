import { fetchAirports, fetchAirportById } from './service';

export async function getAirportsHandler(params: { limit?: number; after?: string; before?: string; query?: string }) {
  const res = await fetchAirports(params.limit, params.after, params.before, params.query);
  const data = Array.isArray((res as any)?.data) ? (res as any).data : ((res as any)?.airports || [])

  const cleaned = data.filter((a: any) => {
    const name = (a?.name || '').toString()
    const iata = (a?.iata_code || '').toString()
    // Filter out obviously invalid entries like numeric-only or weird prefixes
    if (!name || name.length < 3) return false
    if (/^\d+\s/.test(name)) return false // e.g., "12 North ..."
    if (iata && !/^[A-Z]{3}$/i.test(iata)) return false
    return true
  }).map((a: any) => ({
    ...a,
    iata_code: (a?.iata_code || '').toString().toUpperCase() || undefined,
    city_name: a?.city_name ? capitalize(a.city_name) : (a?.city?.name ? capitalize(a.city.name) : undefined),
    name: a?.name ? titleCase(a.name) : a?.name,
  }))

  return { data: cleaned, meta: (res as any)?.meta }
}

function capitalize(s: string) {
  try { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() } catch { return s }
}

function titleCase(s: string) {
  try {
    return s.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w).join(' ')
  } catch { return s }
}

export async function getAirportByIdHandler(params: { id: string }) {
  const res = await fetchAirportById(params.id);
  const a: any = (res as any)?.data || res
  if (!a) return res
  const iata = (a?.iata_code || '').toString()
  const name = (a?.name || '').toString()
  const valid = name && name.length >= 3 && !/^\d+\s/.test(name) && (!iata || /^[A-Z]{3}$/i.test(iata))
  if (!valid) return { data: null }
  const cleaned = {
    ...a,
    iata_code: (a?.iata_code || '').toString().toUpperCase() || undefined,
    city_name: a?.city_name ? capitalize(a.city_name) : (a?.city?.name ? capitalize(a.city.name) : undefined),
    name: a?.name ? titleCase(a.name) : a?.name,
  }
  return { data: cleaned }
}