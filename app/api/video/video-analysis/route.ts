import { NextRequest, NextResponse } from "next/server";

const MODEL = process.env.NEXT_PUBLIC_MODEL_ALLENAI;

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_KEY_ALLENAI;

interface InputMessage {
  role: string;
  content: string;
  imageUrl?: string; // Extracted frame from video
  videoUrl?: string; // All frames as JSON string (for future use)
}

interface ImageContent {
  type: "image_url";
  image_url: {
    url: string;
  };
}

interface TextContent {
  type: "text";
  text: string;
}

interface TransformedMessage {
  role: string;
  content: string | (TextContent | ImageContent)[];
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    if (!MODEL || !OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Mistral AI configuration is missing" },
        { status: 500 }
      );
    }

    // Check if any message contains an image (extracted from video)
    const hasImage = messages.some((msg: InputMessage) => msg.imageUrl);

    if (hasImage) {
      // Warn if using the free model which may not support vision
      if (MODEL.includes("mistral-small-3.1-24b-instruct:free")) {
        console.warn(
          "Warning: The free version of mistral-small-3.1-24b-instruct may not support vision/image input. Consider using a vision-capable model."
        );
      }
    }

    // Transform messages to handle multimodal content (text + images from video frames)
    // Video frames are already extracted on client-side and sent as imageUrl
    const transformedMessages: TransformedMessage[] = messages.map(
      (msg: InputMessage) => {
        if (msg.imageUrl) {
          // Handle image messages (extracted video frames) - convert to OpenRouter format
          const imageUrl = msg.imageUrl;
          const imageContent: ImageContent = {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          };

          // If there's text content along with image
          if (msg.content && msg.content.trim()) {
            return {
              role: msg.role,
              content: [{ type: "text", text: msg.content }, imageContent],
            };
          } else {
            // Only image (from video frame)
            return {
              role: msg.role,
              content: [
                {
                  type: "text",
                  text: "What's in this video? Analyze the key scenes and activities shown in this frame.",
                },
                imageContent,
              ],
            };
          }
        } else {
          // Text-only message
          return {
            role: msg.role,
            content: typeof msg.content === "string" ? msg.content : "",
          };
        }
      }
    );

    const requestBody = {
      model: MODEL,
      messages: transformedMessages,
      stream: true,
    };


    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Video Analysis AI",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }

      console.error("OpenRouter API error:", errorData);

      return NextResponse.json(
        {
          error: errorData.error?.message || "Failed to get response from AI",
          details: errorData,
        },
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
                  break;
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
    console.error("Error in video API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
