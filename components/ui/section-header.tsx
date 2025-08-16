"use client"

import React from "react"
import Image from "next/image"

export type SectionHeaderProps = {
  label?: string
  labelIconSrc?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  labelIconSrc,
  title,
  subtitle,
  align = "center",
  className,
}) => {
  return (
    <div className={className + " " + (align === "center" ? "text-center" : "text-left") }>
      {label && (
        <div className={(align === "center" ? "justify-center " : "") + "flex items-center gap-2 mb-3"}>
          <span className="inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white border border-white/20">
            {labelIconSrc && (
              <Image src={labelIconSrc} alt="label" width={16} height={16} className="mr-1.5 h-3.5 w-auto" />
            )}
            {label}
          </span>
        </div>
      )}
      <h2 className={(align === "center" ? "justify-center " : "") + "flex items-center text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter leading-tight text-white"}>
        <span className="bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">{title}</span>
      </h2>
      {subtitle && (
        <p className={(align === "center" ? "mx-auto " : "") + "mt-3 text-xs sm:text-sm font-medium text-white/70 max-w-2xl"}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeader