export default function PeerComparison() {
  const peers = [
    { name: "You", value: 72 },
    { name: "Team avg", value: 68 },
    { name: "Org avg", value: 64 },
  ]
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-900">Peer Comparison</div>
      <div className="space-y-2">
        {peers.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-20 text-xs text-gray-600">{p.name}</div>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-gray-900" style={{ width: `${p.value}%` }} />
            </div>
            <div className="w-10 text-right text-xs font-medium text-gray-900">{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

