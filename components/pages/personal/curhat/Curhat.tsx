"use client";

import { Card, CardContent } from '@/components/ui/card';

import { Send, User, MessageSquare, Compass, Sparkles, MessageCircle, UsersRound } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { LoadingDots } from '@/components/LoadingDots';

import { Sidebar } from '@/components/ui/sidebar/Sidebar';

import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';

import { InputArea } from '@/components/ui/input-area/InputArea';

import { useStateCurhat } from './lib/useStateCurhat';

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
        handleHistoryClick,
        toggleVoiceRecognition,
    } = useStateCurhat();

    const quickPrompts = [
        { title: 'Interesting Facts', prompt: 'Tell me an interesting fact', icon: Sparkles },
        { title: 'Ask Questions', prompt: 'Help me with a question', icon: MessageCircle },
        { title: 'Casual Chat', prompt: "Let\'s have a casual conversation", icon: MessageSquare },
        { title: 'Get Tips', prompt: 'Give me some helpful tips', icon: Compass },
    ];

    return (
        <AsideLayout>
            <Sidebar
                header={{
                    icon: UsersRound,
                    title: 'Curhat AI',
                    subtitle: 'Teman ngobrol & tanya jawab',
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                mobileIcon={UsersRound}
            >
                <div className="space-y-6">
                    <AsideSectionDivider>Riwayat</AsideSectionDivider>
                    {historyItems.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Belum ada riwayat percakapan.</p>
                    ) : (
                        <div className="space-y-2">
                            {[...historyItems].reverse().map((item, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 px-4 py-3 text-sm text-sidebar-foreground line-clamp-2 cursor-pointer hover:bg-sidebar-accent transition-colors"
                                    title={item.content}
                                    onClick={() => handleHistoryClick(item.content)}
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
                                        <div className="w-16 h-16 items-center justify-center rounded-2xl bg-primary/10 hidden md:flex">
                                            <UsersRound className="w-10 h-10 text-primary" strokeWidth={1.5} />
                                        </div>

                                        <div className="space-y-4 max-w-2xl">
                                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Curhat AI</h2>
                                            <p className="text-base text-muted-foreground">
                                                Have a friendly conversation, ask questions, or get help on various topics.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
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
                                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex gap-2 sm:gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.role === 'assistant' && (
                                                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/15 items-center justify-center shrink-0 shadow-sm hidden md:flex">
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
                                                        <p className="whitespace-pre-wrap wrap-break-word text-sm sm:text-base leading-relaxed text-foreground/95">{message.content}</p>
                                                    ) : message.content === '' ? (
                                                        <LoadingDots />
                                                    ) : (
                                                        <div className="text-foreground prose prose-sm max-w-none">
                                                            <MarkdownRenderer content={message.content} />
                                                        </div>
                                                    )}
                                                </div>
                                                {message.role === 'user' && (
                                                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/15 items-center justify-center shrink-0 shadow-sm hidden md:flex">
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
                    placeholder="Type your message here..."
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