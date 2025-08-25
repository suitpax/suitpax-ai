export default function ImprovementSuggestions() {
  const items = [
    { title: "Book earlier", detail: "Aim for ≥14 days in advance to reduce costs." },
    { title: "Use preferred suppliers", detail: "Stick to negotiated airline/hotel rates." },
    { title: "Share notes post-meeting", detail: "Boost collaboration health and knowledge." },
  ]
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-900">Suggested Improvements</div>
      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
        {items.map((i) => <li key={i.title}><span className="font-medium">{i.title}:</span> {i.detail}</li>)}
      </ul>
    </div>
  )
}

