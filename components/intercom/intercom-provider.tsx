"use client"

import type React from "react"

import { useEffect } from "react"

declare global {
  interface Window {
    Intercom: any
    intercomSettings: any
  }
}

interface IntercomProviderProps {
  children?: React.ReactNode
}

export default function IntercomProvider({ children }: IntercomProviderProps = {}) {
  useEffect(() => {
    const APP_ID = "t7e59vcn"

    // Initialize Intercom
    ;(() => {
      const w = window as any
      const ic = w.Intercom
      if (typeof ic === "function") {
        ic("reattach_activator")
        ic("update", w.intercomSettings)
      } else {
        const d = document
        const i = () => {
          // @ts-ignore
          i.c(arguments)
        }
        // @ts-ignore
        i.q = []
        // @ts-ignore
        i.c = (args: any) => {
          // @ts-ignore
          i.q.push(args)
        }
        w.Intercom = i
        const l = () => {
          const s = d.createElement("script")
          s.type = "text/javascript"
          s.async = true
          s.src = `https://widget.intercom.io/widget/${APP_ID}`
          const x = d.getElementsByTagName("script")[0]
          x.parentNode?.insertBefore(s, x)
        }
        if (document.readyState === "complete") {
          l()
        } else if (w.attachEvent) {
          w.attachEvent("onload", l)
        } else {
          w.addEventListener("load", l, false)
        }
      }
    })()

    // Boot Intercom
    window.Intercom("boot", {
      app_id: APP_ID,
    })

    return () => {
      if (window.Intercom) {
        window.Intercom("shutdown")
      }
    }
  }, [])

  return children || null
}
