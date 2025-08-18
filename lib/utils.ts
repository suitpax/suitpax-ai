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
	options?: { width?: number; height?: number; preferCdn?: boolean; preferUnsplash?: boolean }
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
	// Preferred global fallback: Pexels (kept as default)
	if (!(options?.preferUnsplash)) {
		return `https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&h=${h}&w=${w}&q=80`
	}
	// Optional Unsplash fallback kept available for other contexts
	const q = encodeURIComponent(`${cityName || 'city'} skyline`)
	return `https://source.unsplash.com/featured/${w}x${h}/?${q}`
}