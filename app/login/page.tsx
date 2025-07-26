import { AuthForm } from "@/components/auth/auth-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo/suitpax-bl-logo.webp"
              alt="Suitpax Logo"
              width={140}
              height={30}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-medium tracking-tighter text-black">Welcome Back</h1>
              <p className="text-gray-500 mt-1 text-sm">Sign in to access your workspace.</p>
            </div>
            <AuthForm mode="login" message={searchParams.message} />
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Need an account?{" "}
            <Link href="/signup" className="font-medium text-black hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
