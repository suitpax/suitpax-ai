interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.memoryCache.delete(key)
      }
    }
  }

  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|")
    return `${prefix}:${sortedParams}`
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.memoryCache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.timestamp + entry.ttl) {
      this.memoryCache.delete(key)
      return null
    }

    return entry.data
  }

  async set<T>(key: string, data: T, ttl = this.defaultTTL): Promise<void> {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  async invalidate(pattern: string): Promise<void> {
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key)
      }
    }
  }

  // Utility methods for common cache patterns
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl = this.defaultTTL): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached

    const data = await fetcher()
    await this.set(key, data, ttl)
    return data
  }

  generateUserKey(userId: string, resource: string, params: Record<string, any> = {}): string {
    return this.generateKey(`user:${userId}:${resource}`, params)
  }

  generateGlobalKey(resource: string, params: Record<string, any> = {}): string {
    return this.generateKey(`global:${resource}`, params)
  }
}

export const cache = new CacheManager()
