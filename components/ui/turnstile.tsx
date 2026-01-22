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
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Filter out 401 errors from Cloudflare PAT challenges (these are normal warnings)
    // These errors don't affect Turnstile functionality
    const handleError = (event: ErrorEvent) => {
      const message = event.message || ""
      const source = event.filename || ""

      // Ignore Cloudflare PAT challenge 401 errors (these are expected behavior)
      if (
        source.includes("challenges.cloudflare.com") &&
        (message.includes("401") || message.includes("Failed to load resource"))
      ) {
        event.preventDefault() // Prevent error from showing in console
        return false
      }
      return true
    }

    window.addEventListener("error", handleError, true)

    // Load Turnstile script
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      console.error("Failed to load Cloudflare Turnstile script")
      setHasError(true)
      onError?.()
    }

    document.body.appendChild(script)

    return () => {
      // Remove error listener
      window.removeEventListener("error", handleError, true)

      // Cleanup script
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      // Remove widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [onError])

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile || hasError) return

    const siteKey = process.env.NEXT_PUBLIC_SITE_KEY_CLOUDFLARE
    if (!siteKey) {
      console.error("NEXT_PUBLIC_SITE_KEY_CLOUDFLARE is not set")
      onError?.()
      // Update state in next tick to avoid synchronous setState
      requestAnimationFrame(() => {
        setHasError(true)
      })
      return
    }

    try {
      // Render Turnstile widget
      const widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onVerify(token)
        },
        "error-callback": () => {
          onError?.()
          requestAnimationFrame(() => {
            setHasError(true)
          })
        },
        "expired-callback": () => {
          onExpire?.()
        },
      })

      widgetIdRef.current = widgetId
    } catch (err) {
      console.error("Error rendering Turnstile widget:", err)
      onError?.()
      requestAnimationFrame(() => {
        setHasError(true)
      })
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }, [isLoaded, hasError, onVerify, onError, onExpire])

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

  // Show error message if Turnstile failed to load
  if (hasError) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">
          Unable to load security verification. Please refresh the page.
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
