import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Validate environment variables
        const apiUrl = process.env.NEXT_PUBLIC_MODEL_RIZKI_AI;
        const apiKey = process.env.API_SECRET;

        if (!apiUrl) {
            return NextResponse.json(
                { error: "API URL is not configured" },
                { status: 500 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key is not configured" },
                { status: 500 }
            );
        }

        // Fetch image from AI API
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                {
                    error: `API request failed: ${res.status}`,
                    details: errorText
                },
                { status: res.status }
            );
        }

        // Convert response to blob
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const imageUrl = `data:${blob.type || 'image/png'};base64,${base64}`;

        // Return image URL to client
        return NextResponse.json({
            success: true,
            imageUrl,
            prompt
        });

    } catch (error) {
        return NextResponse.json(
            {
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}