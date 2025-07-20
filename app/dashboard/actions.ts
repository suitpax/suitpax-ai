"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function completeOnboarding() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not found" }
  }

  const { error } = await supabase.from("profiles").update({ has_completed_onboarding: true }).eq("id", user.id)

  if (error) {
    console.error("Error updating onboarding status:", error)
    return { error: "Failed to update onboarding status." }
  }

  revalidatePath("/dashboard")
  return { success: true }
}
