"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import DuffelAncillaries from "./DuffelAncillaries"

class DuffelAncillariesElement extends HTMLElement {
	connectedCallback() {
		const offerId = this.getAttribute("offer-id") || ""
		const mountPoint = document.createElement("div")
		this.appendChild(mountPoint)
		const root = ReactDOM.createRoot(mountPoint)
		root.render(<DuffelAncillaries offerId={offerId} />)
	}
}

export function registerDuffelAncillariesElement() {
	if (typeof window !== "undefined" && !customElements.get("duffel-ancillaries")) {
		customElements.define("duffel-ancillaries", DuffelAncillariesElement)
	}
}