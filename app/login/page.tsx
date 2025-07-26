import { AuthForm } from "@/components/auth/auth-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default async function LoginPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter">Login</h1>
            <p className="text-balance text-gray-500">Enter your email below to login to your account</p>
          </div>
          <AuthForm view="login" />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-gray-100 lg:block relative">
        <Image
          src="/images/airport-lounge-workspace.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-8 left-8 right-8 text-white p-4 bg-black/50 backdrop-blur-sm rounded-lg">
          <h3 className="text-xl font-medium">
            "The future of business travel is here. Automated, intelligent, and seamless."
          </h3>
          <p className="text-sm text-gray-300 mt-2">- Suitpax AI</p>
        </div>
      </div>
    </div>
  )
}
