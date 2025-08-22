"use client"

interface StopsSelectorProps {
	value?: number[]
	onChange?: (val: number[]) => void
}

const OPTIONS = [0, 1, 2]

export default function StopsSelector({ value = [], onChange }: StopsSelectorProps) {
	const toggle = (n: number) => {
		const set = new Set(value)
		if (set.has(n)) set.delete(n)
		else set.add(n)
		onChange?.(Array.from(set))
	}
	const isDirectOnly = value.length === 1 && value[0] === 0
	return (
		<div className="flex flex-wrap gap-2">
			<button
				onClick={() => onChange?.([0])}
				className={`px-3 py-1.5 rounded-full border text-xs ${isDirectOnly ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-300'}`}
			>
				Direct only
			</button>
			{OPTIONS.map((n) => (
				<button
					key={n}
					onClick={() => toggle(n)}
					className={`px-2.5 py-1.5 rounded-lg border text-sm ${value.includes(n) ? 'bg-black text-white border-black' : 'bg-white text-gray-800 border-gray-300'}`}
				>
					{n === 0 ? 'Non-stop' : `${n} stop`}
				</button>
			))}
		</div>
	)
}

