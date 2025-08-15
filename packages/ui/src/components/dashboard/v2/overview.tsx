"use client"

import { TrendingUp, WalletCards, ShieldCheck, Clock, BarChart3 } from "lucide-react"

export default function DashboardOverviewV2() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs text-gray-500">Total income</div>
          <div className="text-3xl font-semibold tracking-tight mt-1">$23,194.80</div>
          <div className="mt-4 h-20 rounded-xl bg-gray-50 border border-gray-200" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Total paid</div>
              <div className="text-3xl font-semibold tracking-tight mt-1">$8,145.20</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-gray-900 text-white inline-flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs text-gray-500">Activity manager</div>
          <div className="mt-3 h-24 rounded-xl bg-gray-50 border border-gray-200" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Wallet verification</div>
              <div className="text-sm text-gray-700">Enable 2-step verification</div>
            </div>
            <button className="px-3 py-1.5 text-xs rounded-lg bg-gray-900 text-white">Enable</button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs text-gray-500">System Lock</div>
          <div className="mt-4 h-28 rounded-xl bg-gray-50 border border-gray-200" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Main Stocks</div>
              <div className="text-2xl font-semibold tracking-tight mt-1">$16,073.49</div>
            </div>
            <BarChart3 className="h-6 w-6 text-gray-900" />
          </div>
          <div className="mt-3 h-16 rounded-xl bg-gray-50 border border-gray-200" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs text-gray-500">Review rating</div>
          <div className="mt-2 text-sm text-gray-800">How is your business management going?</div>
          <div className="mt-3 flex gap-2">
            {[1,2,3,4,5].map(n => (<button key={n} className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-50" />))}
          </div>
        </div>
      </div>
    </div>
  )
}
