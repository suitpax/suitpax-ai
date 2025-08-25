export default function TrendSparkline() {
  const points = [58, 61, 63, 66, 68, 70, 69, 71, 72]
  const max = 100
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-900">Trend</div>
      <div className="h-24 w-full rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-2">
        <svg viewBox="0 0 100 24" className="h-full w-full">
          <polyline
            fill="none"
            stroke="#111827"
            strokeWidth="1.5"
            points={points.map((v, i) => `${(i/(points.length-1))*100},${24 - (v/max)*24}`).join(" ")}
          />
        </svg>
      </div>
    </div>
  )
}

