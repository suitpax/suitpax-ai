export function getMainDomain(): string {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production" ? "https://suitpax.com" : "http://localhost:3000"
  }

  const hostname = window.location.hostname
  if (hostname.includes("localhost")) {
    return "http://localhost:3000"
  }
  return "https://suitpax.com"
}

export function getAppDomain(): string {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production" ? "https://app.suitpax.com" : "http://app.localhost:3000"
  }

  const hostname = window.location.hostname
  if (hostname.includes("localhost")) {
    return "http://app.localhost:3000"
  }
  return "https://app.suitpax.com"
}

export function redirectToMain(): void {
  window.location.href = getMainDomain()
}

export function redirectToApp(path = "/dashboard"): void {
  window.location.href = getAppDomain() + path
}

export function isAppDomain(): boolean {
  if (typeof window === "undefined") return false
  const hostname = window.location.hostname
  return hostname.includes("app.") || hostname.includes("app.localhost")
}

export function isMainDomain(): boolean {
  if (typeof window === "undefined") return false
  const hostname = window.location.hostname
  return !hostname.includes("app.")
}
