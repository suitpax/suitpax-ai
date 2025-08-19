"use client"

export default function CorporateTravelStack() {
  return (
    <section className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-gray-900 mb-6">Corporate Travel Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            'Flights', 'Hotels', 'Cars', 'Rail',
            'Payments', 'Policies', 'Analytics', 'Integrations',
          ].map((t) => (
            <div key={t} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-sm font-medium text-gray-900">{t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

