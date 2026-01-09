"use client";

import { useState, useCallback } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UseChatOptions {
  apiUrl?: string;
  onError?: (error: Error) => void;
}

interface UseChatReturn {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  append: (message: string) => Promise<void>;
}

/**
 * Custom hook untuk chat dengan streaming response
 *
 * @example
 * ```tsx
 * const { messages, input, isLoading, setInput, handleSubmit } = useChat();
 * ```
 */
export function useChat(options?: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setMessages([]);
    setInput("");
    setError(null);
  }, []);

  const append = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: message };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);

      const assistantIndex = newMessages.length;
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      try {
        const apiUrl =
          options?.apiUrl ||
          process.env.NEXT_PUBLIC_CHAT_API_URL ||
          "/api/chat";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
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
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error.message);

        if (options?.onError) {
          options.onError(error);
        }

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
    [messages, isLoading, options]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      await append(input);
      setInput("");
    },
    [input, isLoading, append]
  );

  return {
    messages,
    input,
    isLoading,
    error,
    setInput,
    handleSubmit,
    reset,
    append,
  };
}
