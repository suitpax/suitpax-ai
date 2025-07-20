"use client"

import { login, signup, signInWithGoogle } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FaGoogle } from "react-icons/fa"

type ViewType = "login" | "signup"

export function AuthForm({ view }: { view: ViewType }) {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  const isLogin = view === "login"

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-black/30 backdrop-blur-lg border border-gray-800/50 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <Image src="/logo/suitpax-cloud-logo.webp" alt="Suitpax Logo" width={64} height={64} className="mb-4" />
          </Link>
          <h1 className="text-2xl font-medium tracking-tighter text-white">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isLogin ? "Sign in to access your dashboard." : "Join the future of business travel."}
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-sky-500 focus:border-sky-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-sky-500 focus:border-sky-500 mt-1"
            />
          </div>

          <Button
            formAction={isLogin ? login : signup}
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </Button>

          {message && (
            <p className="text-center text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-md p-2">
              {message}
            </p>
          )}
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/30 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <form>
          <Button
            variant="outline"
            className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white"
            formAction={signInWithGoogle}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/signup" : "/login"} className="text-sky-400 hover:text-sky-300 font-medium">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  )
}
