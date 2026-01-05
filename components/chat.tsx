'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, Plus, Settings, User, LogOut, MessageSquare, Compass, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { MarkdownRenderer } from '@/components/markdown-renderer';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string;
}

const neuralThreads = [
    'Modern Web Design Tips',
    'Next.js 16 Features',
    'Tailwind CSS v4 Guide',
    'React Server Components',
    'AI Integration Tutorial'
];

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fungsi untuk mendeteksi apakah input adalah permintaan generate image
    const isImageRequest = (text: string): boolean => {
        const lowerText = text.toLowerCase();
        const imageKeywords = [
            'generate image',
            'buat gambar',
            'gambar',
            'generate gambar',
            'create image',
            'buat image',
            'gambar dari',
            'image dari',
            'draw',
            'gambarkan',
            'foto',
            'photo',
            'picture',
            'pict'
        ];
        return imageKeywords.some(keyword => lowerText.includes(keyword));
    };

    // Fungsi untuk extract prompt dari input (menghapus kata kunci)
    const extractImagePrompt = (text: string): string => {
        const lowerText = text.toLowerCase();
        const keywords = [
            'generate image',
            'buat gambar',
            'generate gambar',
            'create image',
            'buat image',
            'gambar dari',
            'image dari',
            'draw',
            'gambarkan',
            'foto dari',
            'photo dari',
            'picture dari'
        ];

        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                const index = lowerText.indexOf(keyword);
                const prompt = text.substring(index + keyword.length).trim();
                if (prompt) return prompt;
            }
        }

        // Jika tidak ada keyword, return text as is
        return text.trim();
    };

    // Fungsi untuk validasi apakah string adalah URL gambar atau base64 image yang valid
    const isValidImageUrl = (url: string): boolean => {
        if (!url || typeof url !== 'string') return false;

        // Trim whitespace
        const trimmedUrl = url.trim();

        // Cek jika adalah URL HTTP/HTTPS
        if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            return true;
        }

        // Cek jika adalah data URL dengan format image
        if (trimmedUrl.startsWith('data:image/')) {
            // Validasi format base64 data URL
            const base64Match = trimmedUrl.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,([A-Za-z0-9+/=]+)$/);
            if (base64Match && base64Match[2].length > 100) {
                // Base64 harus cukup panjang untuk menjadi gambar yang valid
                return true;
            }
        }

        return false;
    };

    const handleGenerateImage = async (prompt: string) => {
        if (!prompt.trim() || isGeneratingImage) return;

        const userMessage: Message = {
            role: 'user',
            content: `Generate image: ${prompt}`
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsGeneratingImage(true);

        const assistantMessageIndex = newMessages.length;
        setMessages([...newMessages, {
            role: 'assistant',
            content: 'Generating image...',
            imageUrl: undefined
        }]);

        try {
            let retries = 0;
            const maxRetries = 2;
            let response;
            let errorData;

            // Retry logic untuk handle model loading
            while (retries <= maxRetries) {
                response = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: extractImagePrompt(prompt) }),
                });

                if (response.ok) {
                    break; // Success, keluar dari loop
                }

                errorData = await response.json().catch(() => ({ error: 'Failed to generate image' }));

                // Jika model sedang loading dan masih ada retry, tunggu dan coba lagi
                if (response.status === 503 && errorData.retry && retries < maxRetries) {
                    retries++;
                    // Update message untuk menunjukkan retry
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[assistantMessageIndex] = {
                            role: 'assistant',
                            content: `Model sedang loading... Mencoba lagi (${retries}/${maxRetries})...`,
                            imageUrl: undefined
                        };
                        return updated;
                    });
                    // Tunggu 3 detik sebelum retry
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    continue;
                }

                // Jika bukan retry case atau sudah max retries, throw error
                throw new Error(errorData.error || 'Failed to generate image');
            }

            if (!response || !response.ok) {
                throw new Error(errorData?.error || 'Failed to generate image');
            }

            const data = await response.json();

            if (!data.imageUrl) {
                throw new Error('No image URL returned from API');
            }

            // Validasi bahwa imageUrl adalah gambar yang valid
            const imageUrl = String(data.imageUrl).trim();

            if (!isValidImageUrl(imageUrl)) {
                console.error('Invalid image URL received:', imageUrl.substring(0, 100));
                throw new Error('Invalid image format received. The API may not support image generation with the current model.');
            }

            setMessages(prev => {
                const updated = [...prev];
                updated[assistantMessageIndex] = {
                    role: 'assistant',
                    content: `Here's your generated image:`,
                    imageUrl: imageUrl,
                };
                return updated;
            });
        } catch (error) {
            console.error('Error generating image:', error);
            setMessages(prev => {
                const updated = [...prev];
                updated[assistantMessageIndex] = {
                    role: 'assistant',
                    content: error instanceof Error
                        ? `Maaf, gagal membuat gambar: ${error.message}`
                        : 'Maaf, terjadi kesalahan saat membuat gambar. Silakan coba lagi.',
                };
                return updated;
            });
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || isGeneratingImage) return;

        const inputText = input.trim();
        setInput('');

        // Cek apakah ini adalah permintaan generate image
        if (isImageRequest(inputText)) {
            handleGenerateImage(inputText);
            return;
        }

        const userMessage: Message = { role: 'user', content: inputText };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        const assistantMessageIndex = newMessages.length;
        setMessages([...newMessages, { role: 'assistant', content: '' }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages.map(msg => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const json = JSON.parse(data);
                            if (json.content) {
                                accumulatedContent += json.content;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[assistantMessageIndex] = {
                                        role: 'assistant',
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
            console.error('Error:', error);
            setMessages(prev => {
                const updated = [...prev];
                updated[assistantMessageIndex] = {
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                };
                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
                {/* New Chat Button */}
                <div className="p-3">
                    <Button variant="ghost" className="w-full hover:bg-sidebar-accent text-sidebar-foreground justify-start font-normal">
                        <Plus className="w-4 h-4 mr-2" />
                        New Chat
                    </Button>
                </div>

                {/* Recent Chats */}
                <div className="flex-1 overflow-y-auto px-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                        RECENT
                    </h3>
                    <nav className="space-y-1">
                        {neuralThreads.map((thread, index) => (
                            <button
                                key={index}
                                className="w-full text-left px-3 py-2.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {thread}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Bottom Navigation */}
                <div className="p-3 border-t border-sidebar-border space-y-1">
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm text-red-400 hover:text-red-300 hover:bg-sidebar-accent transition-colors flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-background">
                {/* Header */}
                <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold tracking-tight text-foreground">OpenAI</span>
                        <Badge variant="secondary" className="text-xs tracking-wide">PRO</Badge>
                    </div>
                    <Button variant="ghost" className="text-foreground hover:bg-sidebar-accent">
                        Login
                    </Button>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8">
                            <div className="max-w-4xl w-full space-y-8 flex flex-col items-center">
                                {/* Compass Icon */}
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <Compass className="w-16 h-16 text-foreground opacity-80" strokeWidth={1.5} />
                                </div>

                                {/* Welcome Message */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                                        How can I help you today?
                                    </h1>
                                </div>

                                {/* Suggested Actions */}
                                <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
                                    <Card
                                        className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                        onClick={() => setInput('Tulis kode untuk tombol modern')}
                                    >
                                        <CardContent className="p-0 px-4">
                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                Tulis kode untuk tombol modern
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                        onClick={() => setInput('Jelaskan apa itu React 19')}
                                    >
                                        <CardContent className="p-0 px-4">
                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                Jelaskan apa itu React 19
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                        onClick={() => setInput('Buat ide konten media sosial')}
                                    >
                                        <CardContent className="p-0 px-4">
                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                Buat ide konten media sosial
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                        onClick={() => setInput('Rangkum artikel tentang AI')}
                                    >
                                        <CardContent className="p-0 px-4">
                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                Rangkum artikel tentang AI
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                        onClick={() => setInput('Buat gambar kucing lucu')}
                                    >
                                        <CardContent className="p-0 px-4">
                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                Buat gambar kucing lucu
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                        onClick={() => setInput('Generate image sunset di pantai')}
                                    >
                                        <CardContent className="p-0 px-4">
                                            <p className="text-sm font-medium text-foreground leading-relaxed">
                                                Generate image sunset di pantai
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* AI Assistant Greeting */}
                                <div className="bg-transparent rounded-lg p-4 max-w-2xl mx-auto flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-foreground/90 text-sm leading-relaxed">
                                        Hello! I&apos;m your modern AI assistant. How can I help you today?
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-lg px-5 py-4 ${message.role === 'user'
                                            ? 'bg-card border border-border/40 text-foreground'
                                            : 'text-foreground'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <p className="whitespace-pre-wrap wrap-break-word text-base leading-relaxed text-foreground/95">{message.content}</p>
                                        ) : (
                                            <div className="text-foreground prose prose-sm max-w-none">
                                                <MarkdownRenderer content={message.content} />
                                            </div>
                                        )}
                                        {message.imageUrl && isValidImageUrl(message.imageUrl) && (
                                            <div className="mt-3 rounded-lg overflow-hidden">
                                                <Image
                                                    src={message.imageUrl.trim()}
                                                    alt="Generated"
                                                    width={512}
                                                    height={512}
                                                    className="max-w-full h-auto rounded-lg"
                                                    unoptimized
                                                    onError={(e) => {
                                                        console.error('Error loading image:', e);
                                                        // Remove invalid imageUrl from message
                                                        setMessages(prev => {
                                                            const updated = [...prev];
                                                            updated[index] = {
                                                                ...updated[index],
                                                                imageUrl: undefined,
                                                            };
                                                            return updated;
                                                        });
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {message.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-border bg-background px-6 py-4">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                        <div className="flex gap-2 items-end">
                            <div className="flex-1 relative">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={"Ask ChatGPT..."}
                                    className="min-h-[52px] max-h-[200px] resize-none bg-card border border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 pr-12 text-foreground placeholder:text-muted-foreground placeholder:text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                    disabled={isLoading || isGeneratingImage}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (input.trim()) {
                                            const prompt = input.trim();
                                            setInput('');
                                            handleGenerateImage(prompt);
                                        }
                                    }}
                                    disabled={!input.trim() || isLoading || isGeneratingImage}
                                    className="shrink-0 w-10 h-10 rounded-full bg-transparent hover:bg-sidebar-accent text-foreground p-0"
                                    title="Generate Image"
                                >
                                    {isGeneratingImage ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <ImageIcon className="h-5 w-5" />
                                    )}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isLoading || isGeneratingImage}
                                    className="shrink-0 w-10 h-10 rounded-full bg-transparent hover:bg-sidebar-accent text-foreground p-0"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            ChatGPT can make mistakes. Check important info.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
