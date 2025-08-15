// Cache Service Factory
// Infrastructure layer factory for caching

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

class MemoryCacheService implements CacheService {
  private cache = new Map<string, { value: any; expires: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const expires = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expires });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

class RedisCacheService implements CacheService {
  // Redis implementation would go here
  // For now, fallback to memory cache
  private memoryCache = new MemoryCacheService();

  async get<T>(key: string): Promise<T | null> {
    return this.memoryCache.get(key);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    return this.memoryCache.set(key, value, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    return this.memoryCache.delete(key);
  }

  async clear(): Promise<void> {
    return this.memoryCache.clear();
  }
}

export function createCacheService(): CacheService {
  // Use Redis in production, memory cache in development
  const useRedis = process.env.NODE_ENV === 'production' && process.env.REDIS_URL;
  
  if (useRedis) {
    return new RedisCacheService();
  } else {
    return new MemoryCacheService();
  }
}