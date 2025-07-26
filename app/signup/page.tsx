import Image from "next/image"
import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export default function SignupPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-white">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="flex justify-center">
              <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax Logo" width={160} height={40} className="mb-4" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter">Sign Up</h1>
            <p className="text-balance text-gray-500">Create your account to get started.</p>
          </div>
          <AuthForm type="signup" />
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-gray-100 lg:flex items-center justify-center p-8">
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <video
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supermotion_co%20%282%29-LZW6upr6wueJqrBR2IXAVsHnPh3bJs.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <video
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supermotion_co%20%282%29-GWuBXOG5erdxB4voOtmDHtr4BcHhK6.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
