"use client"

import { useSearchParams } from "next/navigation"
import { login, signup, signInWithGoogle } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PiGoogleLogo } from "react-icons/pi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PiWarningCircle } from "react-icons/pi"

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "login" ? "Sign in to access your dashboard." : "Enter your details to get started."}
        </p>
      </div>

      <div className="grid gap-3">
        <form action={signInWithGoogle}>
          <Button variant="outline" className="w-full border-gray-200 bg-transparent hover:bg-gray-50">
            <PiGoogleLogo className="mr-2 h-4 w-4" />
            Google
          </Button>
        </form>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            required
            className="border-gray-200 bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="border-gray-200 bg-gray-50" />
        </div>
        <Button
          formAction={mode === "login" ? login : signup}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          {mode === "login" ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      {message && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <PiWarningCircle className="h-4 w-4 !text-red-800" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription className="!text-red-800">{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
