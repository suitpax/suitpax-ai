"use client"

import Product from "@/components/marketing/product"
import { SuitpaxAISection as SuitpaxAI } from "@/components/marketing/suitpax-ai-section"

export default function SuitpaxPlatform() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-gray-200 rounded-xl px-3 py-1">
          <span className="text-[10px] font-medium text-gray-700">Suitpax</span>
          <span className="text-[10px] text-gray-500">Platform</span>
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none">
          <em className="font-serif italic">Suitpax Platform</em>
        </h2>
        <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">AI-first building blocks for business travel and expense management.</p>
      </div>
      <div className="space-y-12">
        <Product />
        <div className="bg-black py-12">
          <div className="container mx-auto px-4 md:px-6">
            <SuitpaxAI />
          </div>
        </div>
      </div>
    </section>
  )
}