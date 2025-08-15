"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const router = useRouter()
	const supabase = createClient()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) {
				setError(error.message)
			} else {
				router.push("/dashboard")
			}
		} catch (err) {
			setError("An unexpected error occurred")
		} finally {
			setLoading(false)
		}
	}

	const handleGoogle = async () => {
		setLoading(true)
		setError("")
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			})
			if (error) setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/20 via-transparent to-transparent"></div>
			</div>

			<div className="relative z-10 w-full max-w-md mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-8"
				>
					<div className="flex justify-center mb-6">
						<div className="inline-flex items-center rounded-xl bg-white px-3 py-1.5 border border-gray-200 shadow-sm">
							<Image
								src="/logo/suitpax-bl-logo.webp"
								alt="Suitpax"
								width={80}
								height={20}
								className="h-5 w-auto mr-2"
							/>
							<span className="text-xs font-medium text-gray-700">
								<em className="font-serif italic">Welcome back to your workspace</em>
							</span>
						</div>
					</div>

					<h2 className="text-center text-3xl md:text-4xl font-medium tracking-tighter leading-none text-gray-900 mb-2">
						Sign in
					</h2>
					<p className="text-center text-gray-600 font-light">Access your business travel dashboard</p>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
					<div className="relative bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-200 sm:px-10">
						{loading && (
							<div className="absolute inset-0 z-10 rounded-2xl bg-white/90 flex items-center justify-center">
								<div className="w-6 h-6 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
							</div>
						)}
						<form className="space-y-6" onSubmit={handleLogin}>
							{error && (
								<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-light">
									{error}
								</motion.div>
							)}

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
									Work Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your.email@company.com"
									className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light transition-all"
								/>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										autoComplete="current-password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light transition-all pr-12"
									/>
									<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
										{showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="text-sm">
									<Link href="/auth/forgot-password" className="font-medium text-gray-600 hover:text-black transition-colors">
										Forgot your password?
									</Link>
								</div>
							</div>

							<div>
								<button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all tracking-tight">
									{loading && <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>}
									<span>{loading ? "Signing in..." : "Sign in"}</span>
								</button>
							</div>

							<div className="pt-2">
								<button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
									<FcGoogle className="h-4 w-4" />
									<span>Continue with Google</span>
								</button>
							</div>

							<div className="text-center">
								<span className="text-sm text-gray-600 font-light">Don't have an account? </span>
								<Link href="/auth/signup" className="text-sm font-medium text-black hover:text-gray-700 transition-colors">
									Sign up
								</Link>
							</div>
						</form>
					</div>
				</motion.div>

				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 text-center">
					<Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors font-light">
						<ArrowLeftIcon className="h-4 w-4 mr-2" />
						Back to home
					</Link>
				</motion.div>
			</div>
		</div>
	)
}

export const dynamic = "force-dynamic"
