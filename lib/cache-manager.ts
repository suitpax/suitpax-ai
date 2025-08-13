import { useCallback, useMemo, useRef } from 'react'

// Simple LRU cache entry
interface CacheEntry<T> {
  key: string
  value: T
  expiresAt: number
  size: number
  createdAt: number
  lastAccessedAt: number
}

interface SmartCacheConfig {
  maxSize: number
  defaultTTL: number
}

// Minimalistic in-memory LRU cache tailored for flight search results
class SmartCache<T = any> {
  private entries: Map<string, CacheEntry<T>> = new Map()
  private order: string[] = []
  private hits = 0
  private misses = 0

  constructor(private config: SmartCacheConfig = { maxSize: 50, defaultTTL: 5 * 60 * 1000 }) {}

  private getKey(obj: any): string {
    // Stable stringify
    return JSON.stringify(obj, Object.keys(obj).sort())
  }

  private ensureCapacity() {
    while (this.order.length > this.config.maxSize) {
      const oldestKey = this.order.shift()
      if (oldestKey) {
        this.entries.delete(oldestKey)
      }
    }
  }

  getRaw(key: string): T | null {
    const entry = this.entries.get(key)
    if (!entry) {
      this.misses++
      return null
    }
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key)
      this.order = this.order.filter(k => k !== key)
      this.misses++
      return null
    }
    entry.lastAccessedAt = Date.now()
    // Move to end (most recently used)
    this.order = this.order.filter(k => k !== key)
    this.order.push(key)
    this.hits++
    return entry.value
  }

  setRaw(key: string, value: T, ttl?: number) {
    const entry: CacheEntry<T> = {
      key,
      value,
      expiresAt: Date.now() + (ttl ?? this.config.defaultTTL),
      size: 1,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
    }
    this.entries.set(key, entry)
    this.order = this.order.filter(k => k !== key)
    this.order.push(key)
    this.ensureCapacity()
  }

  getStats() {
    const size = this.entries.size
    const hits = this.hits
    const misses = this.misses
    const hitRate = hits + misses === 0 ? 0 : Math.round((hits / (hits + misses)) * 100)
    return { size, hits, misses, hitRate }
  }

  clear() {
    this.entries.clear()
    this.order = []
    this.hits = 0
    this.misses = 0
  }

  // Flight-search-specific helpers
  getSearchResult(params: any): any | null {
    const key = this.getKey({ type: 'flight', ...params })
    return this.getRaw(key)
  }

  setSearchResult(params: any, data: any, _kind?: 'flight') {
    const key = this.getKey({ type: 'flight', ...params })
    this.setRaw(key, data)
  }
}

export const flightCache = new SmartCache<any>({ maxSize: 100, defaultTTL: 5 * 60 * 1000 })

// React helper used by hooks/use-flight-search.ts
export function useSmartCache() {
  const cacheRef = useRef(flightCache)

  const getStats = useCallback(() => cacheRef.current.getStats(), [])
  const clear = useCallback(() => cacheRef.current.clear(), [])

  // Stubbed example of prefetching some popular routes
  const prefetchPopularRoutes = useCallback(async () => {
    const popularQueries = [
      { origin: 'JFK', destination: 'LAX', departureDate: getFutureDate(30), passengers: 1, cabinClass: 'economy' },
      { origin: 'LHR', destination: 'CDG', departureDate: getFutureDate(45), passengers: 1, cabinClass: 'economy' },
    ]

    await Promise.all(
      popularQueries.map(async (q) => {
        const keyData = { ...q, returnDate: undefined, loyaltyProgrammes: [], corporateDiscounts: false }
        const existing = cacheRef.current.getSearchResult(keyData)
        if (existing) return
        try {
          const res = await fetch('/api/flights/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origin: q.origin,
              destination: q.destination,
              departure_date: q.departureDate,
              passengers: [{ type: 'adult' }],
              cabin_class: q.cabinClass,
            }),
          })
          if (res.ok) {
            const data = await res.json()
            cacheRef.current.setSearchResult(keyData, data, 'flight')
          }
        } catch (_) {
          // ignore prefetch errors
        }
      })
    )
  }, [])

  return useMemo(
    () => ({ cache: cacheRef.current, getStats, clear, prefetchPopularRoutes }),
    [getStats, clear, prefetchPopularRoutes]
  )
}

function getFutureDate(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}
