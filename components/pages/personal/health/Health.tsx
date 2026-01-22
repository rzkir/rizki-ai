"use client";

import { Card, CardContent } from '@/components/ui/card';

import { Send, User, MessageSquare, HeartPulse, HeartHandshake } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { LoadingDots } from '@/components/LoadingDots';

import { Sidebar } from '@/components/ui/sidebar/Sidebar';

import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';

import { InputArea } from '@/components/ui/input-area/InputArea';

import { useStateHealth } from './lib/useStateHealth';

export default function Chat() {
    const {
        messages,
        input,
        setInput,
        isLoading,
        sheetOpen,
        setSheetOpen,
        isListening,
        isSpeechSupported,
        historyItems,
        messagesEndRef,
        messagesContainerRef,
        textareaRef,
        handleSubmit,
        toggleVoiceRecognition,
    } = useStateHealth();

    const quickPrompts = [
        { title: 'Tips Kesehatan Mental', prompt: 'Berikan tips untuk menjaga kesehatan mental', icon: HeartPulse },
        { title: 'Rencana Diet Sehat', prompt: 'Bagaimana cara membuat rencana diet sehat?', icon: HeartPulse },
        { title: 'Latihan untuk Pemula', prompt: 'Rekomendasikan latihan olahraga untuk pemula', icon: HeartPulse },
        { title: 'Manfaat Tidur Cukup', prompt: 'Jelaskan manfaat tidur yang cukup untuk kesehatan', icon: HeartPulse },
    ];

    return (
        <AsideLayout>
            <Sidebar
                header={{
                    icon: HeartPulse,
                    title: 'Health AI',
                    subtitle: 'Wellness, fitness & nutrition',
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                mobileIcon={HeartPulse}
            >
                <div className="space-y-6">
                    <AsideSectionDivider>Riwayat</AsideSectionDivider>
                    {historyItems.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Belum ada riwayat percakapan.</p>
                    ) : (
                        <div className="space-y-2">
                            {historyItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 px-4 py-3 text-sm text-sidebar-foreground line-clamp-2"
                                    title={item.content}
                                >
                                    {item.content}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Sidebar>

            <AsideInset>
                <AsideMain maxWidth="6xl">
                    <div className="py-8 space-y-8">
                        <div className="min-h-[60vh] flex flex-col">
                            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-8">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10">
                                            <HeartHandshake className="w-10 h-10 text-primary" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-4 max-w-2xl">
                                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Health AI</h2>
                                            <p className="text-base text-muted-foreground">
                                                Get personalized health advice, wellness tips, and guidance on fitness, nutrition, and mental health.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
                                            {quickPrompts.map((item, i) => (
                                                <Card
                                                    key={i}
                                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                                    onClick={() => {
                                                        setInput(item.prompt);
                                                        setTimeout(() => textareaRef.current?.focus(), 150);
                                                    }}
                                                >
                                                    <CardContent className="p-0 px-4 flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-primary/15 text-primary">
                                                            <item.icon className="w-4 h-4" />
                                                        </div>

                                                        <div className="min-w-0 text-left">
                                                            <p className="text-sm font-semibold text-foreground leading-relaxed">{item.title}</p>
                                                            <p className="text-xs text-muted-foreground line-clamp-2">{item.prompt}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.role === 'assistant' && (
                                                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                                                        <MessageSquare className="w-5 h-5 text-primary" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${message.role === 'user'
                                                        ? 'bg-card border border-border/40 text-foreground'
                                                        : 'bg-muted/30 border border-border/30 text-foreground'
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
                                                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                                                        <User className="w-5 h-5 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AsideMain>

                <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    onSubmit={handleSubmit}
                    placeholder="Ask about health, wellness, fitness, or nutrition..."
                    isLoading={isLoading}
                    submitIcon={Send}
                    textareaRef={textareaRef}
                    maxWidth="6xl"
                    isListening={isListening}
                    isSpeechSupported={isSpeechSupported}
                    onVoiceToggle={toggleVoiceRecognition}
                />
            </AsideInset>
        </AsideLayout>
    );
}