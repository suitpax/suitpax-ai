import Mem0 from "mem0ai"

let mem0Singleton: any | null = null

export function getMem0Client() {
  if (mem0Singleton) return mem0Singleton
  const apiKey = process.env.MEM0_API_KEY || process.env.NEXT_PUBLIC_MEM0_API_KEY
  if (!apiKey) throw new Error("Missing MEM0_API_KEY")
  mem0Singleton = new (Mem0 as any)({ apiKey })
  return mem0Singleton
}