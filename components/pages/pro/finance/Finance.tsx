"use client";

import { Card, CardContent } from '@/components/ui/card';

import { Send, User, MessageSquare, Compass, Clock } from 'lucide-react';

import { InputArea } from '@/components/ui/input-area';

import { Sidebar } from '@/components/ui/sidebar/Sidebar';

import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { LoadingDots } from '@/components/LoadingDots';

import { useStateFinance } from './lib/useStateFinance';

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
        hasMessages,
        historyItems,
        messagesEndRef,
        messagesContainerRef,
        textareaRef,
        handleSubmit,
        handleHistoryClick,
        toggleVoiceRecognition,
    } = useStateFinance();

    const quickPrompts = [
        { title: 'Anggaran Keuangan', prompt: 'Bagaimana cara membuat anggaran keuangan pribadi?', icon: Compass },
        { title: 'Investasi untuk Pemula', prompt: 'Jelaskan strategi investasi untuk pemula', icon: Compass },
        { title: 'Saham vs Obligasi', prompt: 'Apa perbedaan antara saham dan obligasi?', icon: Compass },
        { title: 'Manajemen Utang', prompt: 'Tips mengelola utang dengan baik', icon: Compass },
    ];

    return (
        <AsideLayout>
            {/* Sidebar untuk riwayat percakapan */}
            <Sidebar
                header={{
                    icon: Clock,
                    title: 'Riwayat Finance',
                    subtitle: `${historyItems.length} percakapan`,
                    badge: <Clock className="w-3 h-3" />,
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            >
                <div className="space-y-4">
                    {historyItems.length === 0 ? (
                        <div className="text-sm text-muted-foreground leading-relaxed border border-sidebar-border/50 rounded-xl p-4 bg-sidebar/30">
                            Belum ada riwayat. Mulai chat, lalu pesanmu akan muncul di sini.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {[...historyItems].reverse().map((item, idx) => (
                                <button
                                    key={`${idx}-${item.content.slice(0, 12)}`}
                                    onClick={() => handleHistoryClick(item.content)}
                                    className="w-full text-left rounded-xl border border-sidebar-border/50 bg-sidebar/40 hover:border-primary/40 hover:bg-primary/5 p-3 transition-colors"
                                >
                                    <p className="text-xs text-muted-foreground mb-1">Prompt</p>
                                    <p className="text-sm text-sidebar-foreground line-clamp-2">{item.content}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Sidebar>

            {/* Main content area */}
            <AsideInset>
                <AsideMain maxWidth="6xl">
                    <div className="py-0 md:py-8 space-y-8">
                        <div className="flex flex-col min-h-[60vh]">
                            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4">
                                {!hasMessages ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-8">
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
                                                <Compass className="w-8 h-8 text-primary" strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-3">
                                                <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                                                    Finance AI Assistant
                                                </h1>
                                                <p className="text-lg text-muted-foreground max-w-2xl">
                                                    Tanyakan apa saja soal keuangan pribadi, investasi, budgeting, dan perencanaan.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <AsideSectionDivider>Suggested Finance Actions</AsideSectionDivider>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
                                                    {quickPrompts.map((item, i) => (
                                                        <Card
                                                            key={i}
                                                            className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                                            onClick={() => setInput(item.prompt)}
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
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 md:space-y-6">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex gap-2 sm:gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.role === 'assistant' && (
                                                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                                                        <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-sm ${message.role === 'user'
                                                        ? 'bg-card border border-border/40 text-foreground'
                                                        : 'bg-muted/30 border border-border/30 text-foreground'
                                                        }`}
                                                >
                                                    {message.role === 'user' ? (
                                                        <p className="whitespace-pre-wrap wrap-break-word text-sm sm:text-base leading-relaxed text-foreground/95">
                                                            {message.content}
                                                        </p>
                                                    ) : message.content === '' ? (
                                                        <LoadingDots />
                                                    ) : (
                                                        <div className="text-foreground prose prose-sm max-w-none">
                                                            <MarkdownRenderer content={message.content} />
                                                        </div>
                                                    )}
                                                </div>
                                                {message.role === 'user' && (
                                                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                                                        <User className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
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

                {/* Fixed Input Area aligned with AsideFooter */}
                <InputArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    onSubmit={() => handleSubmit()}
                    placeholder="Ask about finance, investments, or budgeting..."
                    disabled={isLoading}
                    isLoading={isLoading}
                    isListening={isListening}
                    isSpeechSupported={isSpeechSupported}
                    onVoiceToggle={toggleVoiceRecognition}
                    textareaRef={textareaRef}
                    maxWidth="6xl"
                    submitIcon={Send}
                />
            </AsideInset>
        </AsideLayout>
    );
}