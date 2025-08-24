import { notFound } from "next/navigation"

export default function BookFlightPage({ params }: { params: { id?: string } }) {
	const id = params?.id
	if (!id) return notFound()
	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold">Book Flight</h1>
			<p className="text-sm text-gray-600 mt-2">Offer ID: <strong>{id}</strong></p>
			<p className="text-sm text-gray-500 mt-4">This is a placeholder. Integrate Duffel checkout or your booking flow here.</p>
		</div>
	)
}