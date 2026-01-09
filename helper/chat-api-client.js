/**
 * Client untuk memanggil Chat API dari aplikasi web lain
 *
 * Penggunaan:
 *   import { ChatClient } from './chat-api-client.js';
 *
 *   const client = new ChatClient('https://your-domain.com/api/chat');
 *   await client.sendMessage('Halo, apa kabar?', (chunk) => {
 *     console.log('Chunk:', chunk);
 *   });
 */

export class ChatClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  /**
   * Mengirim pesan ke API dan menerima response streaming
   * @param {string} userMessage - Pesan dari user
   * @param {Function} onChunk - Callback yang dipanggil setiap kali ada chunk baru (optional)
   * @param {Array} conversationHistory - Riwayat percakapan sebelumnya (optional)
   * @returns {Promise<string>} Full response dari AI
   */
  async sendMessage(userMessage, onChunk = null, conversationHistory = []) {
    const messages = [
      ...conversationHistory,
      {
        role: "user",
        content: userMessage,
      },
    ];

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
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

                // Panggil callback jika ada
                if (onChunk && typeof onChunk === "function") {
                  onChunk(json.content, fullResponse);
                }
              }
            } catch {
              // Skip invalid JSON
              console.warn("Invalid JSON chunk:", data);
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error("Error calling chat API:", error);
      throw error;
    }
  }

  /**
   * Mengirim pesan dengan conversation history yang dikelola otomatis
   */
  async sendMessageWithHistory(userMessage, onChunk = null) {
    if (!this.conversationHistory) {
      this.conversationHistory = [];
    }

    const response = await this.sendMessage(
      userMessage,
      onChunk,
      this.conversationHistory
    );

    // Update conversation history
    this.conversationHistory.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: response }
    );

    return response;
  }

  /**
   * Reset conversation history
   */
  resetHistory() {
    this.conversationHistory = [];
  }
}

// Contoh penggunaan untuk browser
export async function exampleUsage() {
  const client = new ChatClient("https://your-domain.com/api/chat");

  // Contoh 1: Simple usage
  const response = await client.sendMessage("Halo, apa kabar?");
  console.log("Response:", response);

  // Contoh 2: Dengan callback untuk real-time update
  await client.sendMessage("Jelaskan apa itu React", (chunk, fullText) => {
    console.log("New chunk:", chunk);
    console.log("Full text so far:", fullText);
    // Update UI di sini
    // document.getElementById('response').textContent = fullText;
  });

  // Contoh 3: Dengan conversation history
  await client.sendMessageWithHistory("Siapa presiden Indonesia?", (chunk) => {
    console.log(chunk);
  });

  await client.sendMessageWithHistory("Kapan dia terpilih?", (chunk) => {
    console.log(chunk);
  });
}
