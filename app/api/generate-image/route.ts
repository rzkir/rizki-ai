import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_MODEL_IMAGE_NIVIDIA;

const IMAGE_MODEL = process.env.NEXT_PUBLIC_API_KEY_NIVIDIA_IMAGE;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL as string,
          "X-Title": "AI Chat",
        },
        body: JSON.stringify({
          model: IMAGE_MODEL,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      console.error("OpenRouter API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // Return error dengan detail yang lebih informatif
      return NextResponse.json(
        {
          error:
            errorData.error?.message ||
            errorData.error ||
            "Failed to generate image",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log("OpenRouter response structure:", {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      messageType: typeof data.choices?.[0]?.message,
      messageKeys: data.choices?.[0]?.message
        ? Object.keys(data.choices[0].message)
        : [],
      contentLength: data.choices?.[0]?.message?.content?.length,
      contentPreview: data.choices?.[0]?.message?.content?.substring(0, 100),
    });

    // Cek images array di message (format untuk model seedream)
    let imageUrl = null;

    // Model seedream mengembalikan gambar di message.images array
    if (
      data.choices?.[0]?.message?.images &&
      Array.isArray(data.choices[0].message.images)
    ) {
      const images = data.choices[0].message.images;
      console.log("Found images array:", images.length, "items");
      if (images.length > 0) {
        // Cek berbagai format di dalam images array
        const firstImage = images[0];
        console.log("First image structure:", Object.keys(firstImage || {}));

        // Struktur untuk seedream: image.image_url.url
        imageUrl =
          firstImage?.image_url?.url ||
          firstImage?.url ||
          firstImage?.image_url ||
          firstImage?.imageUrl ||
          firstImage?.data ||
          firstImage?.b64_json ||
          (typeof firstImage === "string" ? firstImage : null);

        // Pastikan imageUrl adalah string sebelum memanggil startsWith
        if (imageUrl && typeof imageUrl === "string") {
          // Jika image adalah base64, convert ke data URL
          if (!imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
            imageUrl = `data:image/png;base64,${imageUrl}`;
          }
        } else if (imageUrl) {
          // Jika imageUrl adalah object, coba convert ke string
          imageUrl = String(imageUrl);
        }
      }
    }

    // Coba berbagai format response yang mungkin (fallback)
    if (!imageUrl) {
      imageUrl =
        data.choices?.[0]?.message?.image_url ||
        data.choices?.[0]?.message?.url ||
        data.data?.[0]?.url ||
        data.url ||
        data.image_url ||
        data.images?.[0]?.url;
    }

    // Cek content dari message
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      // Jika content adalah base64 image (bisa dimulai dengan data:image atau langsung base64)
      if (content.startsWith("data:image")) {
        imageUrl = content;
      }
      // Jika content adalah URL
      else if (
        content.startsWith("http://") ||
        content.startsWith("https://")
      ) {
        imageUrl = content;
      }
      // Jika content adalah base64 string panjang (tanpa data:image prefix)
      else if (content.length > 100 && /^[A-Za-z0-9+/=]+$/.test(content)) {
        // Coba decode untuk memastikan ini adalah base64 image
        try {
          // Convert base64 ke data URL
          imageUrl = `data:image/png;base64,${content}`;
        } catch {
          // Bukan base64 yang valid
        }
      }
      // Coba parse sebagai JSON
      else {
        try {
          const parsed = JSON.parse(content);
          imageUrl =
            parsed.url ||
            parsed.image_url ||
            parsed.imageUrl ||
            parsed.image ||
            parsed.data;
        } catch {
          // Bukan JSON, lanjutkan
        }
      }
    }

    // Cek jika ada image di response body langsung
    if (!imageUrl && data.image) {
      imageUrl = data.image;
    }

    if (!imageUrl) {
      // Log struktur lengkap untuk debugging
      const message = data.choices?.[0]?.message;
      console.error("No image URL found. Full response structure:", {
        choices: data.choices,
        message: message,
        messageKeys: message ? Object.keys(message) : [],
        images: message?.images,
        imagesType: Array.isArray(message?.images)
          ? "array"
          : typeof message?.images,
        imagesLength: Array.isArray(message?.images)
          ? message.images.length
          : 0,
        firstImageKeys:
          Array.isArray(message?.images) && message.images[0]
            ? Object.keys(message.images[0])
            : [],
        messageContent: message?.content?.substring(0, 200),
        messageContentType: typeof message?.content,
        allKeys: Object.keys(data),
      });

      // Coba ekstrak dari content jika itu adalah base64 panjang
      if (content && content.length > 1000) {
        // Kemungkinan besar ini adalah base64 image
        try {
          imageUrl = `data:image/png;base64,${content}`;
          console.log("Using content as base64 image");
        } catch (e) {
          console.error("Failed to use content as base64:", e);
        }
      }

      if (!imageUrl) {
        return NextResponse.json(
          {
            error: "No image generated. Response format tidak dikenali.",
            debug: {
              hasChoices: !!data.choices,
              choicesLength: data.choices?.length,
              messageKeys: data.choices?.[0]?.message
                ? Object.keys(data.choices[0].message)
                : [],
              contentLength: content?.length,
              contentPreview: content?.substring(0, 100),
            },
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error in generate-image API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
