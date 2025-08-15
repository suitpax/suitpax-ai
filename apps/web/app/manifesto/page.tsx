import type { Metadata } from "next"
import ModernManifestoShowcase from "@/components/marketing/modern-manifesto-showcase"
import ManifestoShowcaseAlt from "@/components/marketing/manifesto-showcase-alt"

export const metadata: Metadata = {
  title: "Manifesto | Suitpax",
  description:
    "Our mission is to transform how companies manage travel, combining cutting-edge AI with human-centered design.",
}

export default function ManifestoPage() {
  return (
    <>
      <ModernManifestoShowcase />
      <ManifestoShowcaseAlt />
    </>
  )
}
