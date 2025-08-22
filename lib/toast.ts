import { toast } from "react-hot-toast"
import React from "react"

export const showToast = (message: string, duration = 2500) => {
	return toast.custom(
		() => (
			<div className="inline-flex items-center gap-2 rounded-xl bg-gray-200 text-black border border-gray-300 px-3 py-2 shadow-sm">
				<span className="flex items-center gap-1">
					<span className="inline-block h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
					<span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-300 animate-pulse [animation-delay:150ms]" />
				</span>
				<span className="text-sm">{message}</span>
			</div>
		),
		{ duration }
	)
}

export const showError = (message: string, duration = 3000) => showToast(message, duration)

export const showLoading = (message = "Loading…") => toast.loading(message)
export const dismissToast = (id?: string) => toast.dismiss(id)