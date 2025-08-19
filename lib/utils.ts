import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toLowerSlug(input?: string) {
	return (input || '').toLowerCase().trim().replace(/\s+/g, '-')
}

export function resolveCityImage(
	cityName?: string,
	options?: { width?: number; height?: number; preferCdn?: boolean; preferUnsplash?: boolean; preferPexels?: boolean }
) {
	const w = options?.width || 640
	const h = options?.height || 400
	const slug = toLowerSlug(cityName)
	try {
		// Attempt local mapping
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const map = require('@/data/cities.json') as Record<string, string>
		if (slug && map[slug]) return map[slug]
	} catch {}
	// Optional CDN (kept available)
	if ((options?.preferCdn ?? true) && slug) {
		return `https://cdn.suitpax.com/cities/${slug}.webp`
	}
	// Prefer our Edge proxy backed by Pexels if we have a city
	if (slug) {
		return `/api/images/city?city=${encodeURIComponent(cityName || 'city')}&w=${w}&h=${h}`
	}
	// Last resort: Unsplash featured per topic
	const q = encodeURIComponent(`${cityName || 'city'} skyline landmark`)
	return `https://source.unsplash.com/featured/${w}x${h}/?${q}`
}