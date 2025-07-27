import { AuthForm } from "@/components/auth/auth-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex flex-col lg:grid lg:grid-cols-2">
      <div className="relative h-64 lg:h-full w-full bg-gray-900 flex items-end justify-center p-8 lg:p-12 overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/supermotion_co%20%282%29-LZW6upr6wueJqrBR2IXAVsHnPh3bJs.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 text-white text-center max-w-md">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Access the Future of Business Travel</h2>
          <p className="mt-2 text-sm text-gray-300">
            Log in to manage your trips, expenses, and policies with the power of AI. Your intelligent dashboard awaits.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 bg-white lg:order-first">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="flex justify-center">
              <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={150} height={40} className="mb-4" />
            </Link>
          </div>
          <AuthForm mode="login" />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-sm font-medium text-gray-900 hover:text-gray-700">
              Sign up
            </Link>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500">
            <Link href="/" className="inline-flex items-center gap-2 hover:text-gray-800 transition-colors">
              <Image src="/logo/suitpax-symbol.webp" alt="Suitpax Symbol" width={16} height={16} />
              <span>Technology by Suitpax</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
