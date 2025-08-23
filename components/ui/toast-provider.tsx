"use client"

import { Toaster } from "react-hot-toast"

export default function ToastProvider() {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 3000,
				style: {
					background: "#e5e7eb",
					color: "#111827",
					border: "1px solid #d1d5db",
					borderRadius: "14px",
					boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
					fontSize: "14px",
				},
			}}
		/>
	)
}

