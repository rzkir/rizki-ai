import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 400 }
      );
    }

    const secretKey = process.env.CLOUDFLARE_SECRET_KEY;
    if (!secretKey) {
      console.error("CLOUDFLARE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Verify Turnstile token with Cloudflare
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "Turnstile verification failed", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying Turnstile:", error);
    return NextResponse.json(
      { error: "Failed to verify Turnstile", success: false },
      { status: 500 }
    );
  }
}
