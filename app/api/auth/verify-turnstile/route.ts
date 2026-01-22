import { NextResponse } from "next/server";

/**
 * Validates Turnstile token using Cloudflare Siteverify API
 * Follows Cloudflare's official documentation best practices
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    // Input validation
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "No token provided", success: false, "error-codes": ["missing-input-response"] },
        { status: 400 }
      );
    }

    // Token length validation (max 2048 characters per Cloudflare docs)
    if (token.length > 2048) {
      return NextResponse.json(
        { error: "Token too long", success: false, "error-codes": ["invalid-input-response"] },
        { status: 400 }
      );
    }

    const secretKey = process.env.CLOUDFLARE_SECRET_KEY;
    if (!secretKey) {
      console.error("CLOUDFLARE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error", success: false, "error-codes": ["missing-input-secret"] },
        { status: 500 }
      );
    }

    // Get client IP for better validation (optional but recommended)
    const remoteip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      request.headers.get("X-Real-IP") ||
      null;

    // Use FormData as recommended by Cloudflare (supports both JSON and FormData)
    // FormData is more efficient and is the preferred method
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    // Verify Turnstile token with Cloudflare Siteverify API
    // Using timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`Siteverify API returned ${response.status}`);
      }

      const data = await response.json();

      // Check validation result
      if (!data.success) {
        const errorCodes = data["error-codes"] || ["unknown-error"];
        console.error("Turnstile verification failed:", errorCodes);

        return NextResponse.json(
          {
            error: "Turnstile verification failed",
            success: false,
            "error-codes": errorCodes
          },
          { status: 400 }
        );
      }

      // Success - token is valid
      return NextResponse.json({
        success: true,
        challenge_ts: data.challenge_ts,
        hostname: data.hostname,
      });
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Validation timeout", success: false, "error-codes": ["internal-error"] },
          { status: 500 }
        );
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Error verifying Turnstile:", error);
    return NextResponse.json(
      { error: "Failed to verify Turnstile", success: false, "error-codes": ["internal-error"] },
      { status: 500 }
    );
  }
}
