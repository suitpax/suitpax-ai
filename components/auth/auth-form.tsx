"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login, signup, signInWithGoogle } from "@/app/auth/actions"
import { PiGoogleLogo, PiSpinnerGap } from "react-icons/pi"

interface AuthFormProps {
  mode: "login" | "signup"
  message?: string
}

export function AuthForm({ mode, message }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    try {
      if (mode === "login") {
        await login(formData)
      } else {
        await signup(formData)
      }
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign in error:", error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const anyLoading = isLoading || isGoogleLoading

  return (
    <div className="w-full space-y-6">
      {message && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-gray-600">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            required
            disabled={anyLoading}
            className="h-10 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-gray-600">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={anyLoading}
            className="h-10 rounded-lg"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-9 text-sm font-medium rounded-xl bg-black text-white hover:bg-black/80 shadow-sm"
          disabled={anyLoading}
        >
          {isLoading ? (
            <PiSpinnerGap className="animate-spin h-5 w-5" />
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-400">OR</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-9 text-sm font-medium bg-white rounded-xl border-gray-300 hover:bg-gray-50 text-black"
        onClick={handleGoogleSignIn}
        disabled={anyLoading}
      >
        {isGoogleLoading ? (
          <PiSpinnerGap className="animate-spin h-5 w-5" />
        ) : (
          <>
            <PiGoogleLogo className="mr-2 h-4 w-4" />
            Continue with Google
          </>
        )}
      </Button>

      <div className="mt-6 text-center text-sm text-gray-600">
        {mode === "login" ? (
          <p>
            Need an account?{" "}
            <Link href="/signup" className="font-medium text-black hover:underline">
              Sign up for free
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
