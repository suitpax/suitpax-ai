import { LoadingState } from "@/components/ui/loading-state"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState
          type="travel"
          message="Cargando ubicaciones y destinos disponibles..."
          className="min-h-[500px]"
        />
      </div>
    </div>
  )
}
