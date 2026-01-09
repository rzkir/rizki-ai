# Cara Memanggil API Chat dari Web Lain

API endpoint: `POST /api/chat`

## Format Request

**URL:** `https://your-domain.com/api/chat` (ganti dengan domain Anda)

**Method:** POST

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Halo, apa kabar?"
    }
  ]
}
```

**Response:** Streaming (Server-Sent Events format)

---

## Contoh Implementasi

### 1. JavaScript/TypeScript (Browser)

```javascript
async function callChatAPI(userMessage) {
  const messages = [
    {
      role: "user",
      content: userMessage,
    },
  ];

  try {
    const response = await fetch("https://your-domain.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

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
              fullResponse += json.content;
              // Update UI dengan konten yang baru diterima
              console.log("Chunk:", json.content);
              // Contoh: updateElement.textContent = fullResponse;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Penggunaan
callChatAPI("Jelaskan apa itu React")
  .then((response) => console.log("Full response:", response))
  .catch((error) => console.error("Error:", error));
```

### 2. JavaScript/TypeScript (Node.js)

```javascript
import fetch from "node-fetch"; // atau gunakan fetch native di Node 18+

async function callChatAPI(userMessage) {
  const messages = [
    {
      role: "user",
      content: userMessage,
    },
  ];

  try {
    const response = await fetch("https://your-domain.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

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
              fullResponse += json.content;
              process.stdout.write(json.content); // Print real-time
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
```

### 3. Python (requests library)

```python
import requests
import json

def call_chat_api(user_message):
    url = "https://your-domain.com/api/chat"

    payload = {
        "messages": [
            {
                "role": "user",
                "content": user_message
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, stream=True)
        response.raise_for_status()

        full_response = ""

        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                if decoded_line.startswith('data: '):
                    data = decoded_line[6:]
                    if data == '[DONE]':
                        break

                    try:
                        json_data = json.loads(data)
                        if 'content' in json_data:
                            content = json_data['content']
                            full_response += content
                            print(content, end='', flush=True)  # Print real-time
                    except json.JSONDecodeError:
                        pass

        return full_response

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        raise

# Penggunaan
if __name__ == "__main__":
    response = call_chat_api("Jelaskan apa itu Python")
    print(f"\n\nFull response: {response}")
```

### 4. Python (httpx - untuk async)

```python
import httpx
import json

async def call_chat_api(user_message):
    url = "https://your-domain.com/api/chat"

    payload = {
        "messages": [
            {
                "role": "user",
                "content": user_message
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        async with client.stream('POST', url, json=payload, headers=headers) as response:
            response.raise_for_status()

            full_response = ""

            async for line in response.aiter_lines():
                if line.startswith('data: '):
                    data = line[6:]
                    if data == '[DONE]':
                        break

                    try:
                        json_data = json.loads(data)
                        if 'content' in json_data:
                            content = json_data['content']
                            full_response += content
                            print(content, end='', flush=True)
                    except json.JSONDecodeError:
                        pass

            return full_response

# Penggunaan
import asyncio
asyncio.run(call_chat_api("Halo, apa kabar?"))
```

### 5. cURL (untuk testing)

```bash
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Halo, apa kabar?"
      }
    ]
  }' \
  --no-buffer
```

### 6. React Component Example

```tsx
import { useState } from "react";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Tambahkan placeholder untuk assistant message
    const assistantIndex = newMessages.length;
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("https://your-domain.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
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
          content: "Maaf, terjadi kesalahan.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Render messages */}
      {messages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}
```

---

## Catatan Penting

1. **CORS**: Jika memanggil dari domain berbeda, pastikan server Next.js Anda mengizinkan CORS. Tambahkan di `next.config.ts`:

   ```typescript
   async headers() {
     return [
       {
         source: '/api/chat',
         headers: [
           { key: 'Access-Control-Allow-Origin', value: '*' },
           { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
           { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
         ],
       },
     ];
   }
   ```

2. **Streaming Response**: API ini mengembalikan streaming response, jadi Anda perlu membaca response secara bertahap (chunk by chunk).

3. **Format Response**: Setiap chunk memiliki format:

   ```
   data: {"content":"text here"}\n\n
   ```

4. **Error Handling**: Pastikan menangani error dengan baik, termasuk network errors dan parsing errors.
