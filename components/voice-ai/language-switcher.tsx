"use client"

import { useVoiceAI } from "@/contexts/voice-ai-context"

export function LanguageSwitcher() {
  const { settings, setLanguage } = useVoiceAI()
  return (
    <select className="text-xs rounded-md border border-gray-200 bg-white px-2 py-1" value={settings.language} onChange={(e) => setLanguage(e.target.value as any)}>
      <option value="en-US">EN</option>
      <option value="es-ES">ES</option>
      <option value="fr-FR">FR</option>
      <option value="de-DE">DE</option>
    </select>
  )
}