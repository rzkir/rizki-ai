"use client";

import { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent } from '@/components/ui/card';

import { Send, Loader2, User, MessageSquare, Compass } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { streamChat } from '@/lib/api-client';

import { API_ENDPOINTS } from '@/lib/config';

import { useTextareaRef } from '@/hooks/text-areaRef';

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { textareaRef, resetHeight } = useTextareaRef({ input });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const inputText = input.trim();
        setInput('');
        resetHeight();

        const userMessage: Message = { role: 'user', content: inputText };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        const assistantMessageIndex = newMessages.length;
        setMessages([...newMessages, { role: 'assistant', content: '' }]);

        let finalContent = '';

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
                endpoint: API_ENDPOINTS.academia,
                messages: newMessages,
                onChunk: (content) => {
                    finalContent = content;
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

            // Setelah selesai menerima semua data, jika ini adalah pesan pertama, tambahkan sambutan tambahan
            if (messages.length === 0 && finalContent) {
                setMessages(prev => {
                    const updated = [...prev];
                    const lastAssistantMessage = updated[updated.length - 1];
                    if (lastAssistantMessage && lastAssistantMessage.role === 'assistant') {
                        // Tambahkan sambutan menarik ke pesan asisten terakhir
                        const welcomeAddition = '\n\nSaya di sini untuk membantu menjawab pertanyaan akademikmu, memberikan saran tentang metodologi penelitian, atau membantu memahami konsep-konsep kompleks. Apa yang ingin kamu pelajari hari ini? 📚';
                        updated[updated.length - 1] = {
                            ...lastAssistantMessage,
                            content: lastAssistantMessage.content + welcomeAddition
                        };
                    }
                    return updated;
                });
            }
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
                                    Academic AI Assistant
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Get expert guidance on research, studies, and academic topics
                                </p>
                            </div>

                            {/* Suggested Academic Actions */}
                            <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setInput('Explain the research methodology for academic studies')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Research Methodology
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setInput('How to write a literature review')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Literature Review
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setInput('What are the key components of a research paper')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Research Paper Structure
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setInput('How to conduct data analysis for academic research')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Data Analysis
                                        </p>
                                    </CardContent>
                                </Card>
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
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={"Ask academic questions..."}
                                className="min-h-[60px] max-h-[200px] resize-none bg-card border border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 pr-12 text-foreground placeholder:text-muted-foreground placeholder:text-sm overflow-y-auto"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                disabled={isLoading}
                                rows={1}
                            />
                        </div>
                        <div className="flex gap-2">
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
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        Academic AI Assistant may provide information that should be verified through scholarly sources.
                    </p>
                </form>
            </div>
        </div>
    );
}