"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile: {
      render: (element: HTMLElement, options: {
        sitekey: string
        callback?: (token: string) => void
        "error-callback"?: () => void
        "expired-callback"?: () => void
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface ResetTurnstileRef {
  resetTurnstile: () => void
}

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  className?: string
}

export function Turnstile({ onVerify, onError, onExpire, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup script
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      // Remove widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) return

    const siteKey = process.env.NEXT_PUBLIC_SITE_KEY_CLOUDFLARE
    if (!siteKey) {
      console.error("NEXT_PUBLIC_SITE_KEY_CLOUDFLARE is not set")
      return
    }

    // Render Turnstile widget
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        onVerify(token)
      },
      "error-callback": () => {
        onError?.()
      },
      "expired-callback": () => {
        onExpire?.()
      },
    })

    widgetIdRef.current = widgetId

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [isLoaded, onVerify, onError, onExpire])

  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }

  // Expose reset method via ref (optional, if needed)
  useEffect(() => {
    if (containerRef.current) {
      ; (containerRef.current as unknown as ResetTurnstileRef).resetTurnstile = reset
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
