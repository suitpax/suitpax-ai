"use client"

import CarrierLogo from "@/components/flights/ui/carrier-logo"

interface Props { iata?: string; name?: string; className?: string; width?: number; height?: number }
export default function AirlineLogo(props: Props) {
  return <CarrierLogo {...props} />
}

