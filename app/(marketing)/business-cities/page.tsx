export default function BusinessCitiesPage() {
  const cities = [
    { id: 'london', name: 'London', landmark: 'Big Ben', airline: { name: 'British Airways', logo: '/logo/airlines/ba.svg' } },
    { id: 'new-york', name: 'New York', landmark: 'Statue of Liberty', airline: { name: 'Delta', logo: '/logo/airlines/dl.svg' } },
    { id: 'paris', name: 'Paris', landmark: 'Eiffel Tower', airline: { name: 'Air France', logo: '/logo/airlines/af.svg' } },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tighter">Business Cities</h1>
          <p className="text-gray-600 font-light">Key hubs with recommended carriers and highlights</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map(c => (
            <div key={c.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="h-40 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="text-lg font-medium text-gray-900">{c.name}</div>
                <div className="text-sm text-gray-600">Iconic: {c.landmark}</div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <img src={c.airline.logo} alt={c.airline.name} className="h-4 w-auto" />
                  <span className="text-sm text-gray-800">Recommended: {c.airline.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

