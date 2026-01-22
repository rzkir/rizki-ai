import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { auth } from "@/utils/firebase/Admins";

// Set session expiration to 5 days
const SESSION_EXPIRATION_DAYS = 5;

export async function POST(request: Request) {
  try {
    const { idToken, turnstileToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Verify Turnstile token if provided
    // Server-side validation is mandatory per Cloudflare documentation
    if (turnstileToken) {
      const secretKey = process.env.CLOUDFLARE_SECRET_KEY;
      if (secretKey) {
        try {
          // Get client IP for better validation
          const remoteip =
            request.headers.get("CF-Connecting-IP") ||
            request.headers.get("X-Forwarded-For") ||
            request.headers.get("X-Real-IP") ||
            null;

          // Use FormData as recommended by Cloudflare
          const formData = new FormData();
          formData.append("secret", secretKey);
          formData.append("response", turnstileToken);
          if (remoteip) {
            formData.append("remoteip", remoteip);
          }

          // Set timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          try {
            const turnstileResponse = await fetch(
              "https://challenges.cloudflare.com/turnstile/v0/siteverify",
              {
                method: "POST",
                body: formData,
                signal: controller.signal,
              }
            );

            if (!turnstileResponse.ok) {
              throw new Error(`Siteverify API returned ${turnstileResponse.status}`);
            }

            const turnstileData = await turnstileResponse.json();

            if (!turnstileData.success) {
              const errorCodes = turnstileData["error-codes"] || ["unknown-error"];
              console.error("Turnstile verification failed:", errorCodes);
              return NextResponse.json(
                {
                  error: "Turnstile verification failed",
                  "error-codes": errorCodes
                },
                { status: 400 }
              );
            }

            clearTimeout(timeoutId);
          } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError instanceof Error && fetchError.name === "AbortError") {
              return NextResponse.json(
                { error: "Turnstile validation timeout" },
                { status: 500 }
              );
            }
            throw fetchError;
          }
        } catch (turnstileError) {
          console.error("Error verifying Turnstile:", turnstileError);
          return NextResponse.json(
            { error: "Failed to verify Turnstile" },
            { status: 400 }
          );
        }
      }
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * SESSION_EXPIRATION_DAYS * 1000; // 5 days in milliseconds
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000, // Convert to seconds
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

// Endpoint to verify session and get user data
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json({
      authenticated: true,
      uid: decodedClaims.uid,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
