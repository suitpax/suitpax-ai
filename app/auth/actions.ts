"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/", "layout")
  const appUrl = process.env.NODE_ENV === "development" ? "http://app.localhost:3000" : "https://app.suitpax.com"
  return redirect(`${appUrl}/dashboard`)
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/", "layout")
  return redirect("/login?message=Check email to continue sign in process")
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const isDevelopment = process.env.NODE_ENV === "development"
  const callbackUrl = isDevelopment ? "http://localhost:3000/auth/callback" : "https://suitpax.com/auth/callback"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  })

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    return redirect(data.url)
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  const mainUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://suitpax.com"
  return redirect(mainUrl)
}
