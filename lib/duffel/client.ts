import { Duffel } from "@duffel/api"

let duffelSingleton: Duffel | null = null

export function getDuffelClient() {
  if (duffelSingleton) return duffelSingleton
  const token = process.env.DUFFEL_API_KEY || process.env.NEXT_PUBLIC_DUFFEL_API_KEY
  if (!token) throw new Error("Missing Duffel API key")
  duffelSingleton = new Duffel({ token })
  return duffelSingleton
}

