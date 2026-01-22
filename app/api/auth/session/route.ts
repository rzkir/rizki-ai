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
    if (turnstileToken) {
      const secretKey = process.env.CLOUDFLARE_SECRET_KEY;
      if (secretKey) {
        try {
          const turnstileResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                secret: secretKey,
                response: turnstileToken,
              }),
            }
          );

          const turnstileData = await turnstileResponse.json();

          if (!turnstileData.success) {
            return NextResponse.json(
              { error: "Turnstile verification failed" },
              { status: 400 }
            );
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
