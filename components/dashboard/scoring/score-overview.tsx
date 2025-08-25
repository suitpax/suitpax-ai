export default function ScoreOverview({ score }: { score: number }) {
  const tier = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Needs work"
  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex items-center justify-center text-2xl font-semibold">
        {score}
      </div>
      <div>
        <div className="text-lg font-medium text-gray-900">Overall Score</div>
        <div className="text-sm text-gray-600">Tier: {tier}</div>
      </div>
    </div>
  )
}

