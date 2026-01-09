# Cara Memanggil API Chat dari Next.js (Vercel)

Contoh implementasi untuk memanggil API Chat dari aplikasi Next.js yang di-hosting di Vercel.

---

## Setup Environment Variables

Tambahkan di `.env.local` atau di Vercel Environment Variables:

```env
NEXT_PUBLIC_CHAT_API_URL=https://your-domain.com/api/chat
```

**Catatan:** Ganti `your-domain.com` dengan domain Next.js yang menjalankan API Chat.

---

## 1. Client Component (untuk UI interaktif)

Buat file `app/chat/page.tsx` atau `components/ChatClient.tsx`:

```tsx
"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Tambahkan placeholder untuk assistant message
    const assistantIndex = newMessages.length;
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "/api/chat";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const json = JSON.parse(data);
              if (json.content) {
                accumulatedContent += json.content;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[assistantIndex] = {
                    role: "assistant",
                    content: accumulatedContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIndex] = {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pesan..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Mengirim..." : "Kirim"}
        </button>
      </form>
    </div>
  );
}
```

---

## 2. Custom Hook (Reusable)

Buat file `hooks/useChat.ts`:

```tsx
"use client";

import { useState, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseChatReturn {
  messages: Message[];
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function useChat(apiUrl?: string): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const reset = useCallback(() => {
    setMessages([]);
    setInput("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage: Message = { role: "user", content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      const assistantIndex = newMessages.length;
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      try {
        const url =
          apiUrl || process.env.NEXT_PUBLIC_CHAT_API_URL || "/api/chat";

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const json = JSON.parse(data);
                if (json.content) {
                  accumulatedContent += json.content;

                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[assistantIndex] = {
                      role: "assistant",
                      content: accumulatedContent,
                    };
                    return updated;
                  });
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = {
            role: "assistant",
            content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          };
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages, isLoading, apiUrl]
  );

  return {
    messages,
    input,
    isLoading,
    setInput,
    handleSubmit,
    reset,
  };
}
```

**Penggunaan hook:**

```tsx
"use client";

import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { messages, input, isLoading, setInput, handleSubmit, reset } =
    useChat();

  return (
    <div>
      {/* Render messages dan form */}
      <button onClick={reset}>Reset Chat</button>
    </div>
  );
}
```

---

## 3. Server Action (Next.js 13+ App Router)

Buat file `app/actions/chat.ts`:

```tsx
"use server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function sendChatMessage(
  messages: Message[]
): Promise<ReadableStream<Uint8Array>> {
  const apiUrl =
    process.env.CHAT_API_URL || process.env.NEXT_PUBLIC_CHAT_API_URL;

  if (!apiUrl) {
    throw new Error("CHAT_API_URL is not configured");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body!;
}
```

**Penggunaan di Client Component:**

```tsx
"use client";

import { sendChatMessage } from "@/app/actions/chat";
import { useState } from "react";

export default function ChatWithServerAction() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const stream = await sendChatMessage(newMessages);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const json = JSON.parse(data);
              if (json.content) {
                accumulatedContent += json.content;
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: accumulatedContent },
                ]);
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <div>{/* Render messages dan form */}</div>;
}
```

---

## 4. API Route (Proxy Pattern)

Jika Anda ingin membuat proxy di aplikasi Next.js Anda sendiri, buat `app/api/chat-proxy/route.ts`:

```tsx
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiUrl =
      process.env.CHAT_API_URL || process.env.NEXT_PUBLIC_CHAT_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        { error: "Chat API URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get response from chat API" },
        { status: response.status }
      );
    }

    // Forward the streaming response
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
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
```

Kemudian di client, panggil `/api/chat-proxy` sebagai gantinya.

---

## 5. Konfigurasi Vercel

### Environment Variables di Vercel

1. Buka project di Vercel Dashboard
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan:
   - `NEXT_PUBLIC_CHAT_API_URL` = `https://your-api-domain.com/api/chat`

### vercel.json (Optional)

Jika perlu konfigurasi khusus:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

---

## 6. TypeScript Types

Buat file `types/chat.ts`:

```tsx
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponseChunk {
  content: string;
}
```

---

## 7. Error Handling & Loading States

Contoh lengkap dengan error handling:

```tsx
"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { messages, input, isLoading, setInput, handleSubmit } = useChat();
  const [error, setError] = useState<string | null>(null);

  const handleSubmitWithError = async (e: React.FormEvent) => {
    setError(null);
    try {
      await handleSubmit(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Messages dan form */}
    </div>
  );
}
```

---

## Best Practices untuk Vercel

1. **Environment Variables**: Gunakan `NEXT_PUBLIC_` prefix untuk variables yang perlu diakses di client
2. **Caching**: Vercel secara otomatis cache API routes, pastikan response headers sesuai
3. **Rate Limiting**: Pertimbangkan untuk menambahkan rate limiting jika perlu
4. **Error Monitoring**: Integrasikan dengan Vercel Analytics atau Sentry
5. **Streaming**: Vercel mendukung streaming dengan baik, pastikan response headers benar

---

## Testing

Test dengan curl dari terminal:

```bash
curl -X POST https://your-nextjs-app.vercel.app/api/chat-proxy \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Halo, test dari Vercel"
      }
    ]
  }' \
  --no-buffer
```
