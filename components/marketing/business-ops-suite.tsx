"use client"

export default function BusinessOpsSuite() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-gray-900 mb-6">AI Business Ops Suite</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Policy & Approvals', desc: 'Automated policy checks, one-click approvals, and audit logs.' },
            { title: 'Finance & Expenses', desc: 'Receipt capture, auto-categorization, and ERP sync.' },
            { title: 'Travel Care', desc: 'Proactive rebooking, disruption alerts, and duty-of-care.' },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="text-lg font-medium text-gray-900">{c.title}</div>
              <p className="text-sm text-gray-600 mt-2">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

