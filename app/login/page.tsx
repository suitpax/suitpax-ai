import { AuthForm } from "@/components/auth/auth-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-black py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Tech orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-[5%] w-64 h-64 rounded-full bg-gradient-to-br from-sky-500/5 to-purple-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/5 to-sky-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AuthForm view="login" />
      </div>
    </section>
  )
}
