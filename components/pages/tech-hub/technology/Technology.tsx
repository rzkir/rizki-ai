"use client";

import { Send, User, MessageSquare, Compass, Clock, Cpu } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { LoadingDots } from '@/components/LoadingDots';

import { Sidebar } from '@/components/ui/sidebar/Sidebar';

import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';

import { InputArea } from '@/components/ui/input-area/InputArea';

import { useStateTechnology } from './lib/useStateTechnology';

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
        messagesEndRef,
        messagesContainerRef,
        textareaRef,
        handleSubmit,
        toggleVoiceRecognition,
        suggestedPrompts,
    } = useStateTechnology();

    return (
        <AsideLayout>
            <Sidebar
                header={{
                    icon: Cpu,
                    title: 'History Technology',
                    subtitle: `0 percakapan`,
                    badge: <Clock className="w-3 h-3" />,
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                mobileIcon={Compass}
            >
                <div className="space-y-4">
                    <AsideSectionDivider>Suggested</AsideSectionDivider>
                </div>
            </Sidebar>

            <AsideInset>
                <AsideMain maxWidth="7xl">
                    {/* Messages Area */}
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 min-h-[70vh]">
                                <div className="max-w-5xl w-full space-y-8 flex flex-col items-center">
                                    <div className="w-16 h-16 flex items-center justify-center">
                                        <Cpu className="w-16 h-16 text-foreground opacity-80" strokeWidth={1.5} />
                                    </div>

                                    <div className="text-center space-y-4">
                                        <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                                            How can I help you today?
                                        </h1>
                                    </div>

                                    <div className="bg-transparent rounded-lg p-4 max-w-2xl mx-auto flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </div>
                                        <p className="text-foreground/90 text-sm leading-relaxed">
                                            Hello! I&apos;m your technology expert assistant. Ask me anything about technology, innovations, or tech trends!
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 w-full max-w-2xl space-y-3">
                                        {suggestedPrompts.map((item, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setInput(item.prompt)}
                                                className="w-full group flex items-start gap-3 rounded-xl border border-sidebar-border/50 bg-sidebar-accent/60 hover:border-primary/40 hover:bg-primary/10 transition-all p-3 text-left"
                                            >
                                                <div className="p-2 rounded-lg bg-primary/15 text-primary">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-sidebar-foreground group-hover:text-primary">{item.text}</p>
                                                    <p className="text-xs text-muted-foreground/80 line-clamp-2">{item.prompt}</p>
                                                </div>
                                            </button>
                                        ))}
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
                    placeholder="Ask about technology..."
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