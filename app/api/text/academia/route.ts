import { NextRequest, NextResponse } from "next/server";

const MODEL = process.env.NEXT_PUBLIC_MODEL_XIOMI;

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_API_KEY_XIOMI_CHAT;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Enhance the prompt to be more academia-focused
    // Check if system message already exists
    const hasSystemMessage = messages.some((msg) => msg.role === "system");

    // Add system instruction for academia context at the beginning if it doesn't exist
    const enhancedMessages = hasSystemMessage
      ? messages
      : [
          {
            role: "system",
            content:
              "You are an approachable academic advisor. Provide helpful and friendly guidance related to research, studies, academic writing, scholarly analysis, and educational topics. For academic questions, provide detailed, evidence-based responses. Be engaging and encourage further discussion.",
          },
          ...messages,
        ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL as string,
          "X-Title": "Academic AI Assistant",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: enhancedMessages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: response.status }
      );
    }

    // Create a ReadableStream to handle streaming
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }

                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(
                      new TextEncoder().encode(
                        `data: ${JSON.stringify({ content })}\n\n`
                      )
                    );
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in academia API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
