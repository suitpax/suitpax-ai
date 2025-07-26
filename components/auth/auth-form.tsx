"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Github } from "lucide-react"
import { login, signup, signInWithGoogle, signInWithGithub } from "@/app/auth/actions"

export function AuthForm({ type }: { type: "login" | "signup" }) {
  const formAction = type === "login" ? login : signup

  return (
    <div className="grid gap-6">
      <form action={formAction}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-gray-50" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="bg-gray-50" />
          </div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
            {type === "login" ? "Login" : "Create account"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <form action={signInWithGithub}>
          <Button variant="outline" className="w-full bg-transparent">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </form>
        <form action={signInWithGoogle}>
          <Button variant="outline" className="w-full bg-transparent">
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
        </form>
      </div>
    </div>
  )
}
