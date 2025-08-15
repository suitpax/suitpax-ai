import Image from "next/image"

interface FooterBannerProps {
  version: string
  userName?: string
}

export default function FooterBanner({ version, userName }: FooterBannerProps) {
  return (
    <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-10 px-4">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <span>Suitpax AI</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{version}</span>
        </div>
        {userName && (
          <div className="text-[11px] text-gray-500">
            Signed in as <span className="text-gray-700 font-medium">{userName}</span>
          </div>
        )}
      </div>
    </div>
  )
}
