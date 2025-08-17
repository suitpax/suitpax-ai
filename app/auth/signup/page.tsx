"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SmallSessionLoader } from "@/components/ui/loaders"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = (await import("@/lib/supabase/client")).createClient()
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push("/dashboard")
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center rounded-xl bg-white/80 backdrop-blur-sm px-3 py-1.5 border border-gray-200 shadow-sm">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={80} height={20} className="h-5 w-auto mr-2" />
            <span className="text-xs font-medium text-gray-700">
              <em className="font-serif italic">Create your workspace</em>
            </span>
          </div>
        </div>

        <h2 className="text-center text-3xl md:text-4xl font-medium tracking-tighter leading-none text-gray-900 mb-2">Sign up</h2>
        <p className="text-center text-gray-600 font-light">Start your business travel journey</p>

        <div className="mt-8 bg-white/50 backdrop-blur-sm py-8 px-6 shadow-sm rounded-2xl border border-gray-200 sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-light">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@company.com" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light transition-all" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light transition-all" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-tight">
              {loading ? <SmallSessionLoader label="Creating your account…" /> : "Create account"}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600 font-light">Already have an account? </span>
              <Link href="/auth/login" className="text-sm font-medium text-black hover:text-gray-700 transition-colors">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
