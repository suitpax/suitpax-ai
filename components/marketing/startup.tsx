"use client"

import Image from "next/image"

const Startup = () => {
  return (
    <section className="w-full bg-black py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-repeat bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 mb-3">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={16} height={16} className="mr-1.5 h-3.5 w-auto" />
            Suitpax Startup
          </div>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-white leading-tight mb-3">
            Suitpax is backed by trusted leaders
          </h2>
          <p className="text-white/70 text-xs sm:text-sm font-medium max-w-2xl mx-auto">
            We build on proven technology and programs to deliver reliable, secure, and high‑performance travel
            infrastructure for modern businesses.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
          <div className="bg-white/10 border border-white/20 rounded-xl p-3 flex items-center justify-center">
            <Image src="/logo/suitpax-bl-logo.webp" alt="Suitpax" width={80} height={24} className="h-5 w-auto" />
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-3 flex items-center justify-center">
            <Image
              src="https://cdn.brandfetch.io/nvidia.com/w/512/h/128/theme/light/logo.png"
              alt="NVIDIA Inception Program"
              width={160}
              height={40}
              className="h-7 w-auto invert"
            />
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-3 flex items-center justify-center">
            <span className="text-white/70 text-xs">More partners coming</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Startup