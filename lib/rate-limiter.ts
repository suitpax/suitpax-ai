export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  canMakeRequest(userId: string, limit: number = 10): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    const recentRequests = userRequests.filter(t => now - t < 60000)
    
    if (recentRequests.length >= limit) {
      return false
    }
    
    this.requests.set(userId, [...recentRequests, now])
    return true
  }
}