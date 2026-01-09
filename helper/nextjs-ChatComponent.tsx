"use client";

import { useChat } from "./nextjs-useChat";

/**
 * Komponen Chat siap pakai untuk Next.js
 * 
 * @example
 * ```tsx
 * import ChatComponent from '@/helper/nextjs-ChatComponent';
 * 
 * export default function ChatPage() {
 *   return <ChatComponent />;
 * }
 * ```
 */
export default function ChatComponent() {
    const {
        messages,
        input,
        isLoading,
        error,
        setInput,
        handleSubmit,
        reset,
    } = useChat();

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h1 className="text-2xl font-bold">Chat AI</h1>
                <button
                    onClick={reset}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Mulai percakapan dengan mengetik pesan di bawah</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap wrap-break-word">
                                    {message.content || (
                                        <span className="text-gray-400">Mengetik...</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tulis pesan..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? "Mengirim..." : "Kirim"}
                </button>
            </form>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-2">
                AI dapat membuat kesalahan. Periksa informasi penting.
            </p>
        </div>
    );
}

