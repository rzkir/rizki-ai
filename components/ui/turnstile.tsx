"use client"

import { useEffect, useRef, useState, useCallback } from "react"

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

// Singleton pattern to ensure script is only loaded once
let scriptLoading = false
let scriptLoaded = false
const loadCallbacks: Array<() => void> = []

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
  const [isLoaded, setIsLoaded] = useState(scriptLoaded || !!window.turnstile)
  const [hasError, setHasError] = useState(false)
  const isRenderedRef = useRef(false)
  const callbacksRef = useRef({ onVerify, onError, onExpire })

  // Update callbacks ref when they change (without causing re-renders)
  useEffect(() => {
    callbacksRef.current = { onVerify, onError, onExpire }
  }, [onVerify, onError, onExpire])

  // Memoize callbacks to prevent unnecessary re-renders
  const handleVerify = useCallback((token: string) => {
    callbacksRef.current.onVerify(token)
  }, [])

  const handleError = useCallback(() => {
    callbacksRef.current.onError?.()
  }, [])

  const handleExpire = useCallback(() => {
    callbacksRef.current.onExpire?.()
  }, [])

  useEffect(() => {
    // Filter out 401 errors from Cloudflare PAT challenges (these are normal warnings)
    const handleErrorEvent = (event: ErrorEvent) => {
      const message = event.message || ""
      const source = event.filename || ""

      // Ignore Cloudflare PAT challenge 401 errors (these are expected behavior)
      if (
        source.includes("challenges.cloudflare.com") &&
        (message.includes("401") || message.includes("Failed to load resource"))
      ) {
        event.preventDefault()
        return false
      }
      return true
    }

    window.addEventListener("error", handleErrorEvent, true)

    // Check if script already exists in DOM
    const existingScript = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    )

    // If script already loaded or exists, mark as loaded
    if (window.turnstile || existingScript) {
      scriptLoaded = true
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setIsLoaded(true)
        // Execute any pending callbacks
        loadCallbacks.forEach(cb => cb())
        loadCallbacks.length = 0
      })
      return () => {
        window.removeEventListener("error", handleErrorEvent, true)
      }
    }

    // If script is already loading, wait for it
    if (scriptLoading) {
      loadCallbacks.push(() => {
        setIsLoaded(true)
      })
      return () => {
        window.removeEventListener("error", handleErrorEvent, true)
      }
    }

    // Start loading script
    scriptLoading = true

    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.id = "turnstile-script" // Add ID to identify script

    script.onload = () => {
      scriptLoaded = true
      scriptLoading = false

      // Ensure window.turnstile is available
      if (window.turnstile) {
        setIsLoaded(true)
        // Execute all pending callbacks
        loadCallbacks.forEach(cb => cb())
        loadCallbacks.length = 0
      } else {
        setTimeout(() => {
          if (window.turnstile) {
            setIsLoaded(true)
            loadCallbacks.forEach(cb => cb())
            loadCallbacks.length = 0
          } else {
            console.error("Turnstile API not available after script load")
            setHasError(true)
            handleError()
          }
        }, 100)
      }
    }

    script.onerror = () => {
      scriptLoading = false
      console.error("Failed to load Cloudflare Turnstile script")
      setHasError(true)
      handleError()
    }

    document.head.appendChild(script)

    return () => {
      window.removeEventListener("error", handleErrorEvent, true)
      // Don't remove script on unmount - it's shared across components
      // Only remove widget
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }, [handleError])

  useEffect(() => {
    // Wait for script to load and ensure window.turnstile is available
    if (!isLoaded || !containerRef.current || !window.turnstile || hasError) return

    // Prevent multiple renders
    if (isRenderedRef.current) return

    const siteKey = process.env.NEXT_PUBLIC_SITE_KEY_CLOUDFLARE
    if (!siteKey) {
      console.error("NEXT_PUBLIC_SITE_KEY_CLOUDFLARE is not set")
      handleError()
      requestAnimationFrame(() => {
        setHasError(true)
      })
      return
    }

    const container = containerRef.current;
    if (!container) return;

    // Check if container already has a widget (prevent duplicate renders)
    if (container.querySelector('iframe[src*="challenges.cloudflare.com"]')) {
      isRenderedRef.current = true
      return
    }

    try {
      // Render Turnstile widget with explicit rendering
      const widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        theme: "auto",
        size: "normal",
        callback: handleVerify,
        "error-callback": (errorCode?: string) => {
          console.error("Turnstile error:", errorCode)
          handleError()
          requestAnimationFrame(() => {
            setHasError(true)
          })
        },
        "expired-callback": handleExpire,
      })

      widgetIdRef.current = widgetId
      isRenderedRef.current = true
    } catch (err) {
      console.error("Error rendering Turnstile widget:", err)
      handleError()
      requestAnimationFrame(() => {
        setHasError(true)
      })
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
          isRenderedRef.current = false
        } catch {
          // Ignore cleanup errors
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, hasError])

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
