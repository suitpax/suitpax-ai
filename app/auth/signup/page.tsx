"use client"

import { useState } from "react"
import Script from "next/script"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const token = formData.get("cf-turnstile-response") as string

    if (!token) {
      setError("Captcha validation failed. Please try again.")
      setLoading(false)
      return
    }

    // Validar captcha en el backend
    const verifyRes = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      setError("Captcha verification failed")
      setLoading(false)
      return
    }

    // Registrar nuevo usuario
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signUpError) {
      setError(signUpError.message)
    } else {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sm:mx-auto sm:w-full sm:max-w-md"
          >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center rounded-xl bg-white/80 backdrop-blur-sm px-3 py-1.5 border border-gray-200 shadow-sm">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={80}
                  height={20}
                  className="h-5 w-auto mr-2"
                />
                <span className="text-xs font-medium text-gray-700">
                  <em className="font-serif italic">
                    Create your account
                  </em>
                </span>
              </div>
            </div>
            <h2 className="text-center text-3xl md:text-4xl font-medium tracking-tighter mb-2">
              Sign Up
            </h2>
            <p className="text-center text-gray-600 font-light">
              Join your business travel workspace
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          >
            <div className="bg-white/50 backdrop-blur-sm py-8 px-6 shadow-sm rounded-2xl border border-gray-200 sm:px-10">
              <form className="space-y-6" onSubmit={handleSignUp}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-light"
                  >
                    {error}
                  </motion.div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Work Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="w-full px-4 py-3 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full px-4 py-3 bg-white border rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <span>🙈</span>
                      ) : (
                        <span>👁️</span>
                      )}
                    </button>
                  </div>
                </div>
                {/* Widget Turnstile */}
                <div
                  className="cf-turnstile"
                  data-sitekey="0x4AAAAAABqYzU_07XKPoPgp"
                ></div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 rounded-xl bg-black text-white disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
                <div className="text-center">
                  <span className="text-sm text-gray-600 font-light">Already have an account? </span>
                  <Link href="/auth/login" className="text-sm font-medium text-black">
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}