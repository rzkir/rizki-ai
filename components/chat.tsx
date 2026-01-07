"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Loader2, User, MessageSquare, Compass, Image as ImageIcon, X } from 'lucide-react';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Please select an image smaller than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const inputText = input.trim();

        // Prepare user message
        let userMessage: Message;
        if (selectedImage) {
            // Create a temporary message with image preview
            // Convert image to base64 for API
            const imageBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                if (selectedImage) {
                    reader.readAsDataURL(selectedImage);
                }
            });

            const tempUserMessage: Message = {
                role: 'user',
                content: inputText,
                imageUrl: `data:image/${selectedImage.type.split('/')[1]};base64,${imageBase64}` || undefined
            };

            const newMessages = [...messages, tempUserMessage];

            setMessages(newMessages);
            setInput('');
            setImagePreview(null);
            setSelectedImage(null);

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
                        messages: newMessages.map(msg => {
                            return {
                                role: msg.role,
                                content: msg.content,
                                ...(msg.imageUrl && { imageUrl: msg.imageUrl })
                            };
                        }),
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
        } else {
            userMessage = {
                role: 'user',
                content: inputText
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setInput('');

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
                        messages: newMessages.map(msg => {
                            return {
                                role: msg.role,
                                content: msg.content,
                                ...(msg.imageUrl && { imageUrl: msg.imageUrl })
                            };
                        }),
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
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
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
                                        <div>
                                            {message.content && (
                                                <p className="whitespace-pre-wrap wrap-break-word text-base leading-relaxed text-foreground/95">{message.content}</p>
                                            )}
                                            {message.imageUrl && (
                                                <Image
                                                    src={message.imageUrl}
                                                    alt="Uploaded content"
                                                    width={300}
                                                    height={200}
                                                    className="mt-2 max-w-full max-h-48 object-contain rounded border border-border/60"
                                                    unoptimized={true}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-foreground prose prose-sm max-w-none">
                                            <MarkdownRenderer content={message.content} />
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

            {/* Fixed Input Area */}
            <div className="border-t border-border bg-background px-6 py-4 sticky bottom-0">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 relative">
                            <div className="flex flex-col gap-2 w-full">
                                {imagePreview && (
                                    <div className="relative w-full max-w-xs">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="max-h-24 object-contain rounded border border-border/60"
                                            unoptimized={true}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setSelectedImage(null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                            disabled={isLoading}
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={"Ask ChatGPT..."}
                                        className="min-h-13 max-h-50 resize-none bg-card border border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 pr-12 text-foreground placeholder:text-muted-foreground placeholder:text-sm"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e);
                                            }
                                        }}
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isLoading}
                                        className="shrink-0"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={(!input.trim() && !selectedImage) || isLoading}
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
    );
}