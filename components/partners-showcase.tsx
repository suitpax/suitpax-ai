"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import HackerNewsBadge from "@/components/ui/hacker-news-badge"

const partnerLogos = [
  { name: "Creandum", url: "https://cdn.brandfetch.io/creandum.com/w/512/h/346/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "Speedinvest", url: "https://cdn.brandfetch.io/speedinvest.com/w/512/h/116/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "CoreNest", url: "https://cdn.brandfetch.io/corenest.com/w/314/h/72/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "A16Z", url: "https://cdn.brandfetch.io/a16z.com/w/512/h/117/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "Atomico", url: "https://cdn.brandfetch.io/atomico.com/w/512/h/102/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
  {
    name: "EQT Group",
    url: "https://cdn.brandfetch.io/eqtgroup.com/w/512/h/149/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Balderton",
    url: "https://cdn.brandfetch.io/balderton.com/w/512/h/88/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  { name: "Redpoint", url: "https://cdn.brandfetch.io/redpoint.com/w/512/h/92/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "Lightspeed", url: "https://cdn.brandfetch.io/lsvp.com/w/512/h/104/theme/light/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "Menlo Ventures", url: "https://cdn.brandfetch.io/menlovc.com/w/512/h/201/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "Encomenda", url: "https://cdn.brandfetch.io/encomenda.com/w/512/h/75/logo?c=1idU-l8vdm7C5__3dci" },
  { name: "Red Alpine", url: "https://cdn.brandfetch.io/redalpine.com/w/180/h/180/logo?c=1idU-l8vdm7C5__3dci" },
  {
    name: "Samaipata",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/62de86640308a912378844f8_Samaipata-logo-primary-hfVG78UNGh3K4YBkpu0btzdUPrB8Ez.svg",
  },
  {
    name: "B2V",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6411c8eb97f067973fecd771_Logo_B2V-SATcCcJFOCejd87mku1SxP6OjMRwEs.svg",
  },
  {
    name: "Battery",
    url: "https://cdn.brandfetch.io/battery.com/w/512/h/136/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Kibo Ventures",
    url: "https://cdn.brandfetch.io/kiboventures.com/w/512/h/305/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "K Fund",
    url: "https://cdn.brandfetch.io/kfund.vc/w/512/h/158/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Octopus Ventures",
    url: "https://cdn.brandfetch.io/octopusventures.com/w/512/h/60/theme/light/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "LeftLane",
    url: "https://cdn.brandfetch.io/leftlane.com/w/512/h/338/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Hummingbird VC",
    url: "https://cdn.brandfetch.io/hummingbird.vc/w/512/h/99/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "Heartcore",
    url: "https://cdn.brandfetch.io/heartcore.com/w/512/h/471/logo?c=1idU-l8vdm7C5__3dci",
  },
  {
    name: "X-Ange / Siparex Group",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LogoXangeSiparex_Black_2024-300x139-J1TZmOCDsembLsKZ7lE62KtSpCGLrO.png",
  },
  {
    name: "Eurazeo",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eurazeo_Logo_Blanc-LrQQUuCUZkWr242WM6QRkhL7LNnvWS.png",
  },
]

interface PartnersShowcaseProps {
  className?: string
  darkMode?: boolean
  showTitle?: boolean
  titleText?: string
}

export const PartnersShowcase = ({
  className = "",
  darkMode = true, // Cambiado a true por defecto
  showTitle = true,
  titleText = "IN THE SPOTLIGHT OF THE WORLD'S LEADING VCs",
}: PartnersShowcaseProps) => {
  const [isMounted, setIsMounted] = useState(false)

  // Evitar problemas de hidratación con Framer Motion
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className={`w-full overflow-hidden py-12 bg-black ${className}`}>
      {showTitle && (
        <div className="text-center mb-8">
          <p className="text-xs font-medium tracking-wider text-gray-300 uppercase">{titleText}</p>
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        {/* Carrusel de logos */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex items-center space-x-16 px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {/* Duplicamos los logos para crear un efecto infinito */}
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div key={index} className="flex items-center justify-center h-12 w-24 relative group">
                <motion.img
                  src={logo.url}
                  alt={`${logo.name} logo`}
                  className="max-h-full max-w-full object-contain transition-all duration-300 brightness-0 invert opacity-40 group-hover:opacity-80 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  style={{ WebkitFontSmoothing: "antialiased" }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400">
                  {logo.name}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Texto mejorado debajo de los logos */}
      <div className="text-center mt-16 max-w-2xl mx-auto px-4 space-y-6">
        <p className="text-white/90 text-sm font-medium tracking-tight">
          Business travel as we know it is about to change. Forever.
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="bg-gray-200 rounded-md px-2 py-0.5 text-xs font-medium text-black flex items-center">
            Launching Q2 2025
            <span className="relative flex h-1.5 w-1.5 ml-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"
                style={{ animationDuration: "3s" }}
              ></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black"></span>
            </span>
          </span>
          <span className="text-gray-400 text-xs">Limited early access available now</span>
        </div>

        {/* Hacker News Badge */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center bg-gray-200 rounded-md px-2 py-0.5 text-xs font-medium">
            <HackerNewsBadge />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse ml-1.5"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnersShowcase
