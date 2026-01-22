"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile: {
      render: (
        element: HTMLElement | string,
        options: {
          sitekey: string
          callback?: (token: string) => void
          "error-callback"?: (errorCode?: string) => void
          "expired-callback"?: () => void
          theme?: "light" | "dark" | "auto"
          size?: "normal" | "compact" | "flexible"
          appearance?: "always" | "execute" | "interaction-only"
          execution?: "render" | "execute"
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
      isExpired: (widgetId: string) => boolean
      ready: (callback: () => void) => void
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

    // Load Turnstile script with explicit rendering mode
    // Using ?render=explicit for programmatic control as per Cloudflare docs
    // IMPORTANT: Do NOT use async or defer attributes - script must load synchronously
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    // Explicitly ensure async and defer are NOT set
    if (script.hasAttribute("async")) {
      script.removeAttribute("async")
    }
    if (script.hasAttribute("defer")) {
      script.removeAttribute("defer")
    }

    script.onload = () => {
      // Ensure window.turnstile is available before marking as loaded
      if (window.turnstile) {
        setIsLoaded(true)
      } else {
        // Retry after a short delay if turnstile is not immediately available
        setTimeout(() => {
          if (window.turnstile) {
            setIsLoaded(true)
          } else {
            console.error("Turnstile API not available after script load")
            setHasError(true)
            onError?.()
          }
        }, 100)
      }
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
    // Wait for script to load and ensure window.turnstile is available
    if (!isLoaded || !containerRef.current || !window.turnstile || hasError) return

    const siteKey = process.env.NEXT_PUBLIC_SITE_KEY_CLOUDFLARE
    if (!siteKey) {
      console.error("NEXT_PUBLIC_SITE_KEY_CLOUDFLARE is not set")
      onError?.()
      requestAnimationFrame(() => {
        setHasError(true)
      })
      return
    }

    const container = containerRef.current;
    if (!container) return;

    try {
      // Render Turnstile widget with explicit rendering
      // Since we already checked isLoaded and window.turnstile exists,
      // we can directly call render without turnstile.ready()
      const widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        theme: "auto", // Automatically adapts to user's theme preference
        size: "normal", // Standard size widget
        callback: (token: string) => {
          onVerify(token)
        },
        "error-callback": (errorCode?: string) => {
          console.error("Turnstile error:", errorCode)
          onError?.()
          requestAnimationFrame(() => {
            setHasError(true)
          })
        },
        "expired-callback": () => {
          console.warn("Turnstile token expired")
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
