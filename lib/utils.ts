import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toLowerSlug(input?: string) {
	return (input || '').toLowerCase().trim().replace(/\s+/g, '-')
}

export function resolveCityImage(cityName?: string, options?: { width?: number; height?: number }) {
	const w = options?.width || 640
	const h = options?.height || 400
	const slug = toLowerSlug(cityName)
	try {
		// Attempt local mapping
		// Using dynamic import so it doesn't bloat client bundles unnecessarily
		// Note: this will be tree-shaken on server where possible
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const map = require('@/data/cities.json') as Record<string, string>
		if (slug && map[slug]) return map[slug]
	} catch {}
	// CDN suggestion (adjust domain if used)
	if (slug) {
		return `https://cdn.suitpax.com/cities/${slug}.webp`
	}
	// Fallback to Unsplash keyword
	const q = encodeURIComponent(`${cityName || 'city'} skyline`)
	return `https://source.unsplash.com/featured/${w}x${h}/?${q}`
}
