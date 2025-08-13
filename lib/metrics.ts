export function createRequestId(prefix: string = "req"): string {
  const random = Math.random().toString(36).slice(2, 8)
  const time = Date.now().toString(36)
  return `${prefix}_${time}_${random}`
}

export function nowMs(): number {
  return performance?.now?.() ?? Date.now()
}

export function elapsedMs(start: number): number {
  const end = nowMs()
  return Math.round(end - start)
}