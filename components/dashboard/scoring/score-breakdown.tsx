export default function ScoreBreakdown() {
  const factors = [
    { name: "On-time behavior", value: 22 },
    { name: "Policy compliance", value: 18 },
    { name: "Spend efficiency", value: 16 },
    { name: "Collaboration health", value: 9 },
    { name: "Knowledge contributions", value: 7 },
  ]
  const total = factors.reduce((a, b) => a + b.value, 0)
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-900">Score Drivers</div>
      <div className="space-y-2">
        {factors.map((f) => (
          <div key={f.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{f.name}</span>
              <span className="text-gray-900 font-medium">+{f.value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" style={{ width: `${(f.value / 30) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

