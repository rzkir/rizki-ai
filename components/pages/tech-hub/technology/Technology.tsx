"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent } from '@/components/ui/card';

import { Send, Loader2, User, MessageSquare, Compass } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { LoadingDots } from '@/components/LoadingDots';

import { streamChat } from '@/lib/api-client';

import { API_ENDPOINTS } from '@/lib/config';

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isUserScrollingRef = useRef<boolean>(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isProgrammaticScrollRef = useRef<boolean>(false);
    const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Helper function to check if user is near bottom of scroll container
    const isNearBottom = useCallback(
        (container: HTMLElement, threshold = 100) => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            return scrollHeight - scrollTop - clientHeight < threshold;
        },
        []
    );

    // Helper function to perform programmatic scroll
    const performScroll = useCallback(() => {
        if (!messagesEndRef.current || isUserScrollingRef.current) return;

        isProgrammaticScrollRef.current = true;
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            isProgrammaticScrollRef.current = false;
        }, 500);
    }, []);

    // Helper function to clear all timeouts
    const clearAllTimeouts = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }
        if (autoScrollTimeoutRef.current) {
            clearTimeout(autoScrollTimeoutRef.current);
            autoScrollTimeoutRef.current = null;
        }
    }, []);

    // Auto-scroll with debounce - only if user is not manually scrolling
    useEffect(() => {
        if (!messagesContainerRef.current || !messagesEndRef.current || isUserScrollingRef.current) {
            return;
        }

        if (autoScrollTimeoutRef.current) {
            clearTimeout(autoScrollTimeoutRef.current);
        }

        autoScrollTimeoutRef.current = setTimeout(() => {
            if (isUserScrollingRef.current) return;

            const container = messagesContainerRef.current;
            if (!container) return;

            if (isNearBottom(container, 50)) {
                requestAnimationFrame(() => {
                    setTimeout(() => performScroll(), 50);
                });
            }
        }, 300);

        return () => {
            if (autoScrollTimeoutRef.current) {
                clearTimeout(autoScrollTimeoutRef.current);
            }
        };
    }, [messages, isNearBottom, performScroll]);

    // Handle manual scroll detection
    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current || isProgrammaticScrollRef.current) return;

        isUserScrollingRef.current = true;

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (messagesContainerRef.current && isNearBottom(messagesContainerRef.current, 50)) {
                isUserScrollingRef.current = false;
                performScroll();
            }
        }, 2000);
    }, [isNearBottom, performScroll]);

    // Add scroll event listener
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearAllTimeouts();
        };
    }, [handleScroll, clearAllTimeouts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const inputText = input.trim();

        // Prepare user message
        const userMessage: Message = {
            role: 'user',
            content: inputText
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        // Reset manual scroll flag when user sends a new message
        isUserScrollingRef.current = false;
        clearAllTimeouts();

        // Force scroll to bottom immediately when user sends a message
        setTimeout(() => performScroll(), 50);

        setIsLoading(true);

        const assistantMessageIndex = newMessages.length;
        setMessages([...newMessages, { role: 'assistant', content: '' }]);

        const handleError = () => {
            setMessages(prev => {
                const updated = [...prev];
                updated[assistantMessageIndex] = {
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                };
                return updated;
            });
        };

        try {
            await streamChat({
                endpoint: API_ENDPOINTS.technology,
                messages: newMessages,
                onChunk: (content) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[assistantMessageIndex] = {
                            role: 'assistant',
                            content: content,
                        };
                        return updated;
                    });
                },
                onError: handleError
            });
        } catch (error) {
            console.error('Error:', error);
            handleError();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
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
                                    onClick={() => setInput('Jelaskan perbedaan antara AI dan Machine Learning')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Jelaskan perbedaan antara AI dan Machine Learning
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setInput('Apa itu Cloud Computing dan manfaatnya?')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Apa itu Cloud Computing dan manfaatnya?
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setInput('Bagaimana cara kerja blockchain?')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Bagaimana cara kerja blockchain?
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setInput('Jelaskan tren teknologi terbaru 2024')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Jelaskan tren teknologi terbaru 2024
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
                                    Hello! I&apos;m your technology expert assistant. Ask me anything about technology, innovations, or tech trends!
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
                                    ) : message.content === '' ? (
                                        <LoadingDots />
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
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={"Ask about technology..."}
                                className="min-h-13 max-h-50 resize-none bg-card border border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 pr-12 text-foreground placeholder:text-muted-foreground placeholder:text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="shrink-0 w-10 h-10 rounded-full bg-transparent hover:bg-sidebar-accent text-foreground p-0"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        AI can make mistakes. Check important info.
                    </p>
                </form>
            </div>
        </div>
    );
}