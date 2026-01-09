import { NextRequest, NextResponse } from "next/server";

/**
 * API Route Proxy untuk Chat API
 *
 * File ini bisa ditempatkan di: app/api/chat-proxy/route.ts
 *
 * Fungsi: Proxy request ke Chat API yang di-hosting di domain lain
 * Berguna jika Anda ingin menyembunyikan URL API atau menambahkan middleware
 */

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Validasi messages
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Ambil URL dari environment variable
    const apiUrl =
      process.env.CHAT_API_URL || process.env.NEXT_PUBLIC_CHAT_API_URL;

    if (!apiUrl) {
      console.error("CHAT_API_URL is not configured");
      return NextResponse.json(
        { error: "Chat API URL not configured" },
        { status: 500 }
      );
    }

    // Forward request ke Chat API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chat API error:", errorText);
      return NextResponse.json(
        { error: "Failed to get response from chat API" },
        { status: response.status }
      );
    }

    // Forward streaming response
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        // CORS headers jika diperlukan
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in chat proxy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS untuk CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
