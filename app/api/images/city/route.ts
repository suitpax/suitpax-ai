import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const city = url.searchParams.get('city') || 'city'
    const w = url.searchParams.get('w') || '640'
    const h = url.searchParams.get('h') || '400'
    const lang = url.searchParams.get('lang') || ''
    const q = `${city} skyline landmark${lang ? ` language:${lang}` : ''}`

    const key = process.env.PEXELS_API_KEY
    if (key) {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1`, {
        headers: { Authorization: key },
        // Reasonable timeout via AbortController if needed
      })
      if (res.ok) {
        const data = await res.json()
        const photo = (data?.photos || [])[0]
        const src = photo?.src?.landscape || photo?.src?.large || photo?.src?.original
        if (src) {
          // Append sizing hints; Pexels srcs already optimized but keep params
          const redirectUrl = `${src}${src.includes('?') ? '&' : '?'}auto=compress&cs=tinysrgb&w=${encodeURIComponent(w)}&h=${encodeURIComponent(h)}&q=80`
          return NextResponse.redirect(redirectUrl, 302)
        }
      }
    }
    // Fallback to Unsplash featured
    const unsplash = `https://source.unsplash.com/featured/${w}x${h}/?${encodeURIComponent(q)}`
    return NextResponse.redirect(unsplash, 302)
  } catch {
    const fallback = 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=640&h=400&q=80'
    return NextResponse.redirect(fallback, 302)
  }
}