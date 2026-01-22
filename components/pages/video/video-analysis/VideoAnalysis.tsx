'use client';

import { Button } from '@/components/ui/button';

import { User, MessageSquare, Upload, X, Video, Send, Film } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { Sidebar } from '@/components/ui/sidebar/Sidebar';

import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';

import { InputArea } from '@/components/ui/input-area/InputArea';

import { useStateVideoAnalysis } from './lib/useStateVideoAnalysis';

export default function VideoAnalysisPage() {
    const {
        prompt,
        setPrompt,
        video,
        messages,
        isAnalyzing,
        sheetOpen,
        setSheetOpen,
        isListening,
        isSpeechSupported,
        historyItems,
        fileInputRef,
        messagesEndRef,
        textareaRef,
        handleVideoChange,
        setVideoFile,
        handleRemoveVideo,
        handleAnalyzeVideo,
        toggleVoiceRecognition,
    } = useStateVideoAnalysis();

    return (
        <AsideLayout>
            <Sidebar
                header={{
                    icon: Film,
                    title: 'Video Analysis',
                    subtitle: 'Understand your videos',
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                mobileIcon={Film}
            >
                <div className="space-y-6">
                    <AsideSectionDivider>Riwayat</AsideSectionDivider>
                    {historyItems.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Belum ada riwayat analisis video.</p>
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
                    <div className="space-y-8">
                        {messages.length === 0 ? (
                            <div className="space-y-12 py-6">
                                <div className="space-y-4 text-center">
                                    <h2 className="text-5xl font-black tracking-tighter leading-none bg-linear-to-br from-white via-white to-primary/50 bg-clip-text text-transparent">
                                        Upload a video <br /> to <span className="gradient-text-purple-blue italic">analyze</span>
                                    </h2>

                                    <p className="text-base text-muted-foreground">
                                        Leverage advanced computer vision to extract insights from your videos instantly.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
                                    <button
                                        onClick={() => {
                                            setPrompt('What actions or activities are happening in this video?');
                                            if (!video) {
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                        className="w-full group flex items-start gap-3 rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 hover:border-primary/40 hover:bg-primary/10 transition-all p-3 text-left"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/15 text-primary">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-sidebar-foreground group-hover:text-primary">Identify Actions</p>
                                            <p className="text-xs text-muted-foreground/80 line-clamp-2">What actions or activities are happening in this video?</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPrompt('Describe this video in detail');
                                            if (!video) {
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                        className="w-full group flex items-start gap-3 rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 hover:border-primary/40 hover:bg-primary/10 transition-all p-3 text-left"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/15 text-primary">
                                            <Film className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-sidebar-foreground group-hover:text-primary">Detailed Description</p>
                                            <p className="text-xs text-muted-foreground/80 line-clamp-2">Describe this video in detail</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPrompt('What is the mood or atmosphere of this video?');
                                            if (!video) {
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                        className="w-full group flex items-start gap-3 rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 hover:border-primary/40 hover:bg-primary/10 transition-all p-3 text-left"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/15 text-primary">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-sidebar-foreground group-hover:text-primary">Analyze Mood</p>
                                            <p className="text-xs text-muted-foreground/80 line-clamp-2">What is the mood or atmosphere of this video?</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPrompt('Analyze video content');
                                            if (!video) {
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                        className="w-full group flex items-start gap-3 rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 hover:border-primary/40 hover:bg-primary/10 transition-all p-3 text-left"
                                    >
                                        <div className="p-2 rounded-lg bg-primary/15 text-primary">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-sidebar-foreground group-hover:text-primary">Analyze Content</p>
                                            <p className="text-xs text-muted-foreground/80 line-clamp-2">Analyze video content</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Upload Area */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative cursor-pointer"
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const file = e.dataTransfer.files[0];
                                        if (file) {
                                            setVideoFile(file);
                                        }
                                    }}
                                >
                                    <div className="absolute -inset-1 bg-linear-to-r from-primary to-chart-3 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                                    <div className="relative bg-card/40 backdrop-blur-xl border-2 border-dashed border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all hover:bg-card/60 group">
                                        <Upload className="w-16 h-16 text-primary/60 group-hover:text-primary transition-colors" />
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-foreground mb-1">Drop your video here</p>
                                            <p className="text-sm text-muted-foreground">or click to browse from your device</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden min-h-[60vh] flex flex-col">
                                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
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
                                                        <div className="space-y-2">
                                                            {message.videoUrl && (
                                                                <div className="mb-2">
                                                                    <video
                                                                        src={message.videoUrl}
                                                                        controls
                                                                        className="rounded-lg object-contain max-h-64 w-auto max-w-full"
                                                                        style={{ maxWidth: '300px' }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <p className="whitespace-pre-wrap wrap-break-word text-base leading-relaxed text-foreground/95">{message.content}</p>
                                                        </div>
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
                                </div>
                            </div>
                        )}
                    </div>
                </AsideMain>

                <InputArea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAnalyzeVideo();
                        }
                    }}
                    onSubmit={handleAnalyzeVideo}
                    placeholder={video ? "Ask a question about the video..." : "Upload a video and ask questions..."}
                    isLoading={isAnalyzing}
                    submitIcon={Send}
                    textareaRef={textareaRef}
                    maxWidth="6xl"
                    textareaClassName="min-h-[60px] max-h-[200px] pr-12"
                    submitDisabled={(!prompt.trim() && !video) || isAnalyzing}
                    isListening={isListening}
                    isSpeechSupported={isSpeechSupported}
                    onVoiceToggle={toggleVoiceRecognition}
                    topSlot={
                        video ? (
                            <div className="flex items-center gap-3">
                                <div className="relative inline-block">
                                    <video
                                        src={video.preview}
                                        className="rounded-lg object-cover border border-border/60 w-[60px] h-[60px]"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border hover:bg-muted text-foreground"
                                        onClick={handleRemoveVideo}
                                        disabled={isAnalyzing}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground truncate flex-1">{video.file.name}</p>
                            </div>
                        ) : undefined
                    }
                    beforeTextarea={
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="video"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="hidden"
                            disabled={isAnalyzing}
                        />
                    }
                />
            </AsideInset>
        </AsideLayout>
    );
}

