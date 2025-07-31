"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      toast.error("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      })

      if (error) {
        setError(error.message)
        toast.error(error.message)
        return
      }

      if (data.user) {
        toast.success("Account created successfully! Please check your email to verify your account.")
        router.push("/auth/login")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        toast.error(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast.error("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gray-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-200/40 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gray-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700">
                <Image
                  src="/logo/suitpax-bl-logo.webp"
                  alt="Suitpax"
                  width={60}
                  height={16}
                  className="mr-1.5 h-4 w-auto"
                />
                <em className="font-serif italic">Join thousands of business travelers</em>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-4">
              Get started
            </h1>
            <p className="text-gray-600 font-light text-sm sm:text-base">
              <em className="font-serif italic">Transform your business travel experience today</em>
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all font-light text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all font-light text-sm sm:text-base"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all font-light text-sm sm:text-base"
                  placeholder="Enter your work email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all font-light text-sm sm:text-base"
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-tight text-sm sm:text-base"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-light">
                    <em className="font-serif italic">Or continue with</em>
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="mt-4 w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-tight flex items-center justify-center text-sm sm:text-base"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600 font-light">
              <em className="font-serif italic">Already have an account?</em>{" "}
              <Link href="/auth/login" className="text-black hover:text-gray-800 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-8"
          >
            <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors font-light">
              <em className="font-serif italic">← Back to home</em>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
