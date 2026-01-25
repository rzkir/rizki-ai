"use client";

import { Send, User, MessageSquare, Compass, Code } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { LoadingDots } from '@/components/LoadingDots';

import { Sidebar } from '@/components/ui/sidebar/Sidebar';

import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';

import { InputArea } from '@/components/ui/input-area/InputArea';

import { useStateProgramming } from '@/components/pages/tech-hub/programming/lib/useStateProgramming';

export default function Chat() {
    const {
        messages,
        input,
        setInput,
        isLoading,
        sheetOpen,
        setSheetOpen,
        messagesEndRef,
        messagesContainerRef,
        textareaRef,
        handleSubmit,
        handleHistoryClick,
        suggestedPrompts,
        isListening,
        isSpeechSupported,
        historyItems,
        toggleVoiceRecognition,
    } = useStateProgramming();

    return (
        <AsideLayout>
            <Sidebar
                header={{
                    icon: Code,
                    title: 'Riwayat Programming',
                    subtitle: 'Chat seputar coding & dev',
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                mobileIcon={Compass}
            >
                <div className="space-y-4">
                    <AsideSectionDivider>Riwayat</AsideSectionDivider>
                    <div className="min-h-50">
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
                </div>
            </Sidebar>

            <AsideInset>
                <AsideMain maxWidth="7xl">
                    {/* Messages Area */}
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-6">
                                <div className="max-w-5xl w-full space-y-6 sm:space-y-8 flex flex-col items-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 items-center justify-center">
                                        <Code className="w-12 h-12 sm:w-16 sm:h-16 text-primary opacity-80" strokeWidth={1.5} />
                                    </div>

                                    <div className="text-center space-y-3 sm:space-y-4">
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight px-4">
                                            How can I help you today?
                                        </h1>
                                    </div>

                                    <div className="bg-transparent rounded-lg p-3 sm:p-4 max-w-2xl mx-auto flex items-start gap-2 sm:gap-3 w-full">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 items-center justify-center shrink-0 mt-1">
                                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                        </div>
                                        <p className="text-foreground/90 text-xs sm:text-sm leading-relaxed">
                                            Hello! I&apos;m your modern AI assistant. How can I help you today?
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-2xl">
                                        {suggestedPrompts.map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setInput(item.prompt)}
                                                className="w-full group flex items-start gap-2 sm:gap-3 rounded-xl border border-sidebar-border/50 bg-sidebar-accent/60 hover:border-primary/40 hover:bg-primary/10 transition-all p-2.5 sm:p-3 text-left"
                                            >
                                                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/15 text-primary shrink-0 hidden md:block">
                                                    <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-semibold text-sidebar-foreground group-hover:text-primary">{item.text}</p>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground/80 line-clamp-2 mt-0.5">{item.prompt}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 md:space-y-6">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-2 sm:gap-3 md:gap-4 min-w-0 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/15 items-center justify-center shrink-0 shadow-sm hidden md:flex">
                                                <MessageSquare className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-sm overflow-hidden ${message.role === 'user'
                                                ? 'bg-card border border-border/40 text-foreground'
                                                : 'bg-muted/30 border border-border/30 text-foreground'
                                                }`}
                                        >
                                            {message.role === 'user' ? (
                                                <p className="whitespace-pre-wrap wrap-break-word text-sm sm:text-base leading-relaxed text-foreground/95 overflow-wrap-anywhere">
                                                    {message.content}
                                                </p>
                                            ) : message.content === '' ? (
                                                <LoadingDots />
                                            ) : (
                                                <div className="text-foreground prose prose-sm max-w-none prose-invert overflow-hidden wrap-break-word [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_code]:break-all [&_pre_code]:break-all">
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
                    placeholder="Ask about programming..."
                    isLoading={isLoading}
                    submitIcon={Send}
                    maxWidth="7xl"
                    isListening={isListening}
                    isSpeechSupported={isSpeechSupported}
                    onVoiceToggle={toggleVoiceRecognition}
                    textareaRef={textareaRef}
                />
            </AsideInset>
        </AsideLayout>
    );
}