"use client"

import NextImage, { type ImageProps } from "next/image"
import * as React from "react"

export interface PromptKitImageProps extends Omit<ImageProps, "alt"> {
  alt?: string
  caption?: string
  rounded?: boolean
}

export function Image({ alt, caption, rounded = true, ...props }: PromptKitImageProps) {
  return (
    <figure className="inline-flex flex-col items-center">
      <NextImage
        alt={alt || ""}
        {...props}
        className={[props.className || "", rounded ? "rounded-xl" : ""].join(" ")}
      />
      {caption ? <figcaption className="mt-1 text-center text-xs text-gray-500">{caption}</figcaption> : null}
    </figure>
  )
}

export default Image

