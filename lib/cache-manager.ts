interface CacheEntry<T> {
  key: string
  data: T
  timestamp: number
  expiresAt: number
  accessCount: number
  lastAccessed: number
  priority: number
  tags: string[]
}

interface CacheConfig {
  maxSize: number
  defaultTTL: number
  cleanupInterval: number
  compressionThreshold: number
  persistToLocalStorage: boolean
}

interface CacheStats {
  hits: number
  misses: number
  evictions: number
  size: number
  hitRate: number
  averageAccessTime: number
}

/**
 * Cache inteligente con LRU, compresión y persistencia
 * Optimizado para búsquedas de vuelos con Duffel
 */
export class SmartCache<T = any> {
  private cache: Map<string, CacheEntry<T>>
  private config: CacheConfig
  private stats: CacheStats
  private cleanupTimer?: NodeJS.Timeout

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map()
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutos
      cleanupInterval: 30 * 1000, // 30 segundos
      compressionThreshold: 10000, // 10KB
      persistToLocalStorage: true,
      ...config
    }
    
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      hitRate: 0,
      averageAccessTime: 0
    }

    this.startCleanupTimer()
    this.loadFromStorage()
  }

  /**
   * Almacena un valor en el cache con TTL y prioridad personalizables
   */
  set(
    key: string, 
    data: T, 
    ttl: number = this.config.defaultTTL,
    priority: number = 1,
    tags: string[] = []
  ): void {
    const now = Date.now()
    
    // Eliminar entrada existente si existe
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Verificar si necesitamos espacio
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed()
    }

    // Comprimir datos grandes si es necesario
    const processedData = this.shouldCompress(data) ? this.compress(data) : data

    const entry: CacheEntry<T> = {
      key,
      data: processedData,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 0,
      lastAccessed: now,
      priority,
      tags
    }

    this.cache.set(key, entry)
    this.updateStats()
    this.persistToStorage()
  }

  /**
   * Obtiene un valor del cache
   */
  get(key: string): T | null {
    const startTime = performance.now()
    
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.stats.misses++
      this.updateStats()
      return null
    }

    // Verificar expiración
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.stats.misses++
      this.updateStats()
      return null
    }

    // Actualizar estadísticas de acceso
    entry.accessCount++
    entry.lastAccessed = Date.now()
    
    this.stats.hits++
    
    // Actualizar tiempo promedio de acceso
    const accessTime = performance.now() - startTime
    this.stats.averageAccessTime = (this.stats.averageAccessTime + accessTime) / 2
    
    this.updateStats()

    // Descomprimir si es necesario
    return this.isCompressed(entry.data) ? this.decompress(entry.data) : entry.data
  }

  /**
   * Verifica si una clave existe y no ha expirado
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  /**
   * Elimina una entrada específica
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.updateStats()
      this.persistToStorage()
    }
    return deleted
  }

  /**
   * Limpia entradas por tags
   */
  invalidateByTags(tags: string[]): number {
    let invalidated = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key)
        invalidated++
      }
    }
    
    if (invalidated > 0) {
      this.updateStats()
      this.persistToStorage()
    }
    
    return invalidated
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear()
    this.updateStats()
    this.clearStorage()
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Obtiene información detallada del cache
   */
  getInfo(): {
    entries: Array<{
      key: string
      size: number
      age: number
      accessCount: number
      expiresIn: number
      tags: string[]
    }>
    totalSize: number
    config: CacheConfig
  } {
    const now = Date.now()
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      size: this.estimateSize(entry.data),
      age: now - entry.timestamp,
      accessCount: entry.accessCount,
      expiresIn: Math.max(0, entry.expiresAt - now),
      tags: entry.tags
    }))

    return {
      entries,
      totalSize: entries.reduce((sum, entry) => sum + entry.size, 0),
      config: this.config
    }
  }

  /**
   * Prefetch de datos comunes
   */
  async prefetch(
    keys: string[], 
    fetcher: (key: string) => Promise<T>
  ): Promise<void> {
    const promises = keys
      .filter(key => !this.has(key))
      .map(async key => {
        try {
          const data = await fetcher(key)
          this.set(key, data, this.config.defaultTTL, 2, ['prefetch'])
        } catch (error) {
          console.warn(`Prefetch failed for key ${key}:`, error)
        }
      })

    await Promise.allSettled(promises)
  }

  /**
   * Configuración de cache por tipo de búsqueda
   */
  setSearchResult(
    searchParams: any,
    result: T,
    type: 'flight' | 'hotel' | 'car' = 'flight'
  ): void {
    const key = this.generateSearchKey(searchParams)
    
    // TTL y prioridad según el tipo de búsqueda
    const config = {
      flight: { ttl: 5 * 60 * 1000, priority: 3 }, // 5 min, alta prioridad
      hotel: { ttl: 10 * 60 * 1000, priority: 2 }, // 10 min, media prioridad
      car: { ttl: 15 * 60 * 1000, priority: 1 }    // 15 min, baja prioridad
    }

    const { ttl, priority } = config[type]
    const tags = [
      type,
      `origin:${searchParams.origin}`,
      `destination:${searchParams.destination}`,
      `date:${searchParams.departureDate}`
    ]

    this.set(key, result, ttl, priority, tags)
  }

  /**
   * Obtener resultado de búsqueda
   */
  getSearchResult(searchParams: any): T | null {
    const key = this.generateSearchKey(searchParams)
    return this.get(key)
  }

  /**
   * Generar clave única para búsquedas
   */
  private generateSearchKey(params: any): string {
    const keyParts = [
      params.origin?.toUpperCase() || '',
      params.destination?.toUpperCase() || '',
      params.departureDate || '',
      params.returnDate || '',
      params.passengers?.toString() || '1',
      params.cabinClass || 'economy',
      JSON.stringify(params.loyaltyProgrammes || []),
      params.corporateDiscounts ? 'corp' : 'std'
    ]
    
    return `search:${keyParts.join('|')}`
  }

  /**
   * Eliminar entradas menos usadas (LRU)
   */
  private evictLeastUsed(): void {
    let leastUsed: CacheEntry<T> | null = null
    let leastUsedKey = ''

    for (const [key, entry] of this.cache.entries()) {
      if (!leastUsed || this.calculateScore(entry) < this.calculateScore(leastUsed)) {
        leastUsed = entry
        leastUsedKey = key
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey)
      this.stats.evictions++
    }
  }

  /**
   * Calcular score para algoritmo LRU con prioridad
   */
  private calculateScore(entry: CacheEntry<T>): number {
    const now = Date.now()
    const age = now - entry.lastAccessed
    const frequency = entry.accessCount
    const priority = entry.priority
    
    // Menor score = más candidato para eliminación
    return (frequency * priority * 1000) / (age + 1)
  }

  /**
   * Compresión simple para datos grandes
   */
  private shouldCompress(data: T): boolean {
    return this.estimateSize(data) > this.config.compressionThreshold
  }

  private compress(data: T): any {
    // Simulación de compresión - en producción usar pako o similar
    return {
      __compressed: true,
      data: JSON.stringify(data)
    }
  }

  private decompress(data: any): T {
    if (this.isCompressed(data)) {
      return JSON.parse(data.data)
    }
    return data
  }

  private isCompressed(data: any): boolean {
    return data && typeof data === 'object' && data.__compressed === true
  }

  /**
   * Estimar tamaño de datos en bytes
   */
  private estimateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size
  }

  /**
   * Limpieza automática de entradas expiradas
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  private cleanup(): void {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      this.updateStats()
    }
  }

  /**
   * Persistencia en localStorage
   */
  private persistToStorage(): void {
    if (!this.config.persistToLocalStorage || typeof localStorage === 'undefined') {
      return
    }

    try {
      const serialized = JSON.stringify({
        cache: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now()
      })
      
      localStorage.setItem('suitpax_flight_cache', serialized)
    } catch (error) {
      console.warn('Failed to persist cache to localStorage:', error)
    }
  }

  private loadFromStorage(): void {
    if (!this.config.persistToLocalStorage || typeof localStorage === 'undefined') {
      return
    }

    try {
      const stored = localStorage.getItem('suitpax_flight_cache')
      if (!stored) return

      const parsed = JSON.parse(stored)
      const now = Date.now()
      
      // Solo cargar si el cache tiene menos de 1 hora
      if (now - parsed.timestamp > 60 * 60 * 1000) {
        localStorage.removeItem('suitpax_flight_cache')
        return
      }

      // Restaurar entradas no expiradas
      for (const [key, entry] of parsed.cache) {
        if (now < entry.expiresAt) {
          this.cache.set(key, entry)
        }
      }

      this.stats = { ...this.stats, ...parsed.stats }
      this.updateStats()
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error)
      localStorage.removeItem('suitpax_flight_cache')
    }
  }

  private clearStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('suitpax_flight_cache')
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0
  }

  /**
   * Destructor para limpiar timers
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.persistToStorage()
  }
}

// Instancia global para la aplicación
export const flightCache = new SmartCache({
  maxSize: 50,
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  cleanupInterval: 30 * 1000, // 30 segundos
  compressionThreshold: 5000, // 5KB
  persistToLocalStorage: true
})

// Hook para usar el cache en componentes React
export function useSmartCache() {
  return {
    cache: flightCache,
    getStats: () => flightCache.getStats(),
    getInfo: () => flightCache.getInfo(),
    clear: () => flightCache.clear(),
    invalidateFlights: () => flightCache.invalidateByTags(['
interface CacheEntry<T> {
  key: string
  data: T
  timestamp: number
  expiresAt: number
  accessCount: number
  lastAccessed: number
  priority: number
  tags: string[]
}

interface CacheConfig {
  maxSize: number
  defaultTTL: number
  cleanupInterval: number
  compressionThreshold: number
  persistToLocalStorage: boolean
}

interface CacheStats {
  hits: number
  misses: number
  evictions: number
  size: number
  hitRate: number
  averageAccessTime: number
}

/**
 * Cache inteligente con LRU, compresión y persistencia
 * Optimizado para búsquedas de vuelos con Duffel
 */
export class SmartCache<T = any> {
  private cache: Map<string, CacheEntry<T>>
  private config: CacheConfig
  private stats: CacheStats
  private cleanupTimer?: NodeJS.Timeout

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map()
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutos
      cleanupInterval: 30 * 1000, // 30 segundos
      compressionThreshold: 10000, // 10KB
      persistToLocalStorage: true,
      ...config
    }
    
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      hitRate: 0,
      averageAccessTime: 0
    }

    this.startCleanupTimer()
    this.loadFromStorage()
  }

  /**
   * Almacena un valor en el cache con TTL y prioridad personalizables
   */
  set(
    key: string, 
    data: T, 
    ttl: number = this.config.defaultTTL,
    priority: number = 1,
    tags: string[] = []
  ): void {
    const now = Date.now()
    
    // Eliminar entrada existente si existe
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Verificar si necesitamos espacio
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed()
    }

    // Comprimir datos grandes si es necesario
    const processedData = this.shouldCompress(data) ? this.compress(data) : data

    const entry: CacheEntry<T> = {
      key,
      data: processedData,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 0,
      lastAccessed: now,
      priority,
      tags
    }

    this.cache.set(key, entry)
    this.updateStats()
    this.persistToStorage()
  }

  /**
   * Obtiene un valor del cache
   */
  get(key: string): T | null {
    const startTime = performance.now()
    
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.stats.misses++
      this.updateStats()
      return null
    }

    // Verificar expiración
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      this.stats.misses++
      this.updateStats()
      return null
    }

    // Actualizar estadísticas de acceso
    entry.accessCount++
    entry.lastAccessed = Date.now()
    
    this.stats.hits++
    
    // Actualizar tiempo promedio de acceso
    const accessTime = performance.now() - startTime
    this.stats.averageAccessTime = (this.stats.averageAccessTime + accessTime) / 2
    
    this.updateStats()

    // Descomprimir si es necesario
    return this.isCompressed(entry.data) ? this.decompress(entry.data) : entry.data
  }

  /**
   * Verifica si una clave existe y no ha expirado
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  /**
   * Elimina una entrada específica
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.updateStats()
      this.persistToStorage()
    }
    return deleted
  }

  /**
   * Limpia entradas por tags
   */
  invalidateByTags(tags: string[]): number {
    let invalidated = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key)
        invalidated++
      }
    }
    
    if (invalidated > 0) {
      this.updateStats()
      this.persistToStorage()
    }
    
    return invalidated
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear()
    this.updateStats()
    this.clearStorage()
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Obtiene información detallada del cache
   */
  getInfo(): {
    entries: Array<{
      key: string
      size: number
      age: number
      accessCount: number
      expiresIn: number
      tags: string[]
    }>
    totalSize: number
    config: CacheConfig
  } {
    const now = Date.now()
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      size: this.estimateSize(entry.data),
      age: now - entry.timestamp,
      accessCount: entry.accessCount,
      expiresIn: Math.max(0, entry.expiresAt - now),
      tags: entry.tags
    }))

    return {
      entries,
      totalSize: entries.reduce((sum, entry) => sum + entry.size, 0),
      config: this.config
    }
  }

  /**
   * Prefetch de datos comunes
   */
  async prefetch(
    keys: string[], 
    fetcher: (key: string) => Promise<T>
  ): Promise<void> {
    const promises = keys
      .filter(key => !this.has(key))
      .map(async key => {
        try {
          const data = await fetcher(key)
          this.set(key, data, this.config.defaultTTL, 2, ['prefetch'])
        } catch (error) {
          console.warn(`Prefetch failed for key ${key}:`, error)
        }
      })

    await Promise.allSettled(promises)
  }

  /**
   * Configuración de cache por tipo de búsqueda
   */
  setSearchResult(
    searchParams: any,
    result: T,
    type: 'flight' | 'hotel' | 'car' = 'flight'
  ): void {
    const key = this.generateSearchKey(searchParams)
    
    // TTL y prioridad según el tipo de búsqueda
    const config = {
      flight: { ttl: 5 * 60 * 1000, priority: 3 }, // 5 min, alta prioridad
      hotel: { ttl: 10 * 60 * 1000, priority: 2 }, // 10 min, media prioridad
      car: { ttl: 15 * 60 * 1000, priority: 1 }    // 15 min, baja prioridad
    }

    const { ttl, priority } = config[type]
    const tags = [
      type,
      `origin:${searchParams.origin}`,
      `destination:${searchParams.destination}`,
      `date:${searchParams.departureDate}`
    ]

    this.set(key, result, ttl, priority, tags)
  }

  /**
   * Obtener resultado de búsqueda
   */
  getSearchResult(searchParams: any): T | null {
    const key = this.generateSearchKey(searchParams)
    return this.get(key)
  }

  /**
   * Generar clave única para búsquedas
   */
  private generateSearchKey(params: any): string {
    const keyParts = [
      params.origin?.toUpperCase() || '',
      params.destination?.toUpperCase() || '',
      params.departureDate || '',
      params.returnDate || '',
      params.passengers?.toString() || '1',
      params.cabinClass || 'economy',
      JSON.stringify(params.loyaltyProgrammes || []),
      params.corporateDiscounts ? 'corp' : 'std'
    ]
    
    return `search:${keyParts.join('|')}`
  }

  /**
   * Eliminar entradas menos usadas (LRU)
   */
  private evictLeastUsed(): void {
    let leastUsed: CacheEntry<T> | null = null
    let leastUsedKey = ''

    for (const [key, entry] of this.cache.entries()) {
      if (!leastUsed || this.calculateScore(entry) < this.calculateScore(leastUsed)) {
        leastUsed = entry
        leastUsedKey = key
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey)
      this.stats.evictions++
    }
  }

  /**
   * Calcular score para algoritmo LRU con prioridad
   */
  private calculateScore(entry: CacheEntry<T>): number {
    const now = Date.now()
    const age = now - entry.lastAccessed
    const frequency = entry.accessCount
    const priority = entry.priority
    
    // Menor score = más candidato para eliminación
    return (frequency * priority * 1000) / (age + 1)
  }

  /**
   * Compresión simple para datos grandes
   */
  private shouldCompress(data: T): boolean {
    return this.estimateSize(data) > this.config.compressionThreshold
  }

  private compress(data: T): any {
    // Simulación de compresión - en producción usar pako o similar
    return {
      __compressed: true,
      data: JSON.stringify(data)
    }
  }

  private decompress(data: any): T {
    if (this.isCompressed(data)) {
      return JSON.parse(data.data)
    }
    return data
  }

  private isCompressed(data: any): boolean {
    return data && typeof data === 'object' && data.__compressed === true
  }

  /**
   * Estimar tamaño de datos en bytes
   */
  private estimateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size
  }

  /**
   * Limpieza automática de entradas expiradas
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  private cleanup(): void {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      this.updateStats()
    }
  }

  /**
   * Persistencia en localStorage
   */
  private persistToStorage(): void {
    if (!this.config.persistToLocalStorage || typeof localStorage === 'undefined') {
      return
    }

    try {
      const serialized = JSON.stringify({
        cache: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now()
      })
      
      localStorage.setItem('suitpax_flight_cache', serialized)
    } catch (error) {
      console.warn('Failed to persist cache to localStorage:', error)
    }
  }

  private loadFromStorage(): void {
    if (!this.config.persistToLocalStorage || typeof localStorage === 'undefined') {
      return
    }

    try {
      const stored = localStorage.getItem('suitpax_flight_cache')
      if (!stored) return

      const parsed = JSON.parse(stored)
      const now = Date.now()
      
      // Solo cargar si el cache tiene menos de 1 hora
      if (now - parsed.timestamp > 60 * 60 * 1000) {
        localStorage.removeItem('suitpax_flight_cache')
        return
      }

      // Restaurar entradas no expiradas
      for (const [key, entry] of parsed.cache) {
        if (now < entry.expiresAt) {
          this.cache.set(key, entry)
        }
      }

      this.stats = { ...this.stats, ...parsed.stats }
      this.updateStats()
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error)
      localStorage.removeItem('suitpax_flight_cache')
    }
  }

  private clearStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('suitpax_flight_cache')
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0
  }

  /**
   * Destructor para limpiar timers
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.persistToStorage()
  }
}

// Instancia global para la aplicación
export const flightCache = new SmartCache({
  maxSize: 50,
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  cleanupInterval: 30 * 1000, // 30 segundos
  compressionThreshold: 5000, // 5KB
  persistToLocalStorage: true
})

// Hook para usar el cache en componentes React
export function useSmartCache() {
  return {
    cache: flightCache,
    getStats: () => flightCache.getStats(),
    getInfo: () => flightCache.getInfo(),
    clear: () => flightCache.clear(),
    invalidateFlights: () => flightCache.invalidateByTags(['flight']),
    prefetchPopularRoutes: async () => {
      const popularRoutes = [
        'JFK|LHR|2024-12-01||1|economy',
        'LAX|NRT|2024-12-15||1|economy',
        'SFO|CDG|2024-11-30||1|business'
      ]
      
      // En una implementación real, esto haría requests a la API
      console.log('Prefetching popular routes:', popularRoutes)
    }
  }
}