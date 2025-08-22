"use client"

import { useVoiceAI } from "@/contexts/voice-ai-context"

export function SettingsPanel() {
  const { settings, setLanguage } = useVoiceAI()
  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-3 backdrop-blur-sm">
      <div className="text-xs text-gray-700 mb-2">Settings</div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600">Language</label>
        <select
          className="text-sm rounded-lg border border-gray-200 bg-white px-2 py-1"
          value={settings.language}
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="en-US">English (US)</option>
          <option value="es-ES">Español (ES)</option>
          <option value="fr-FR">Français</option>
          <option value="de-DE">Deutsch</option>
        </select>
      </div>
    </div>
  )
}