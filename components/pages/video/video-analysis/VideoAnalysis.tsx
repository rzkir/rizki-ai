'use client';

import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

import { User, MessageSquare, Upload, X, Video, Send, Film } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { streamChat } from '@/lib/api-client';

import { API_ENDPOINTS } from '@/lib/config';

import { useTextareaRef } from '@/hooks/text-areaRef';
import { Sidebar } from '@/components/ui/sidebar/Sidebar';
import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';
import { InputArea } from '@/components/ui/input-area/InputArea';

export default function VideoAnalysisPage() {
    type ChatMessage = Message & { videoUrl?: string };

    const [prompt, setPrompt] = useState('');
    const [video, setVideo] = useState<{ file: File; preview: string } | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { textareaRef, resetHeight } = useTextareaRef({ input: prompt });

    const historyItems = messages.filter(message => message.role === 'user');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.match('video.*')) {
                alert('Please select a video file');
                return;
            }

            // Validate file size (max 50MB for video)
            if (file.size > 50 * 1024 * 1024) {
                alert('Please select a video smaller than 50MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setVideo({ file, preview: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveVideo = () => {
        setVideo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Extract frames from video
    const extractVideoFrames = async (videoFile: File): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas context not available'));
                return;
            }

            const frames: string[] = [];
            let frameIndex = 0;
            // Extract frames at start, middle, and near end (if video is long enough)
            const targetFrames = [0, 0.5, 0.9];

            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;
            video.crossOrigin = 'anonymous';

            const objectUrl = URL.createObjectURL(videoFile);
            video.src = objectUrl;

            video.onloadedmetadata = () => {
                try {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // Determine how many frames to extract based on video duration
                    const duration = video.duration;
                    const framesToExtract = duration > 2
                        ? targetFrames
                        : [0]; // Only extract first frame for short videos

                    // Start extracting first frame
                    extractFrameAt(framesToExtract[0]);
                } catch (error) {
                    URL.revokeObjectURL(objectUrl);
                    reject(error);
                }
            };

            const extractFrameAt = (timeRatio: number) => {
                try {
                    video.currentTime = video.duration * timeRatio;
                } catch (error) {
                    URL.revokeObjectURL(objectUrl);
                    reject(error);
                }
            };

            video.onseeked = () => {
                try {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    frames.push(frameDataUrl);

                    frameIndex++;
                    const duration = video.duration;
                    const framesToExtract = duration > 2 ? targetFrames : [0];

                    if (frameIndex < framesToExtract.length) {
                        // Extract next frame
                        extractFrameAt(framesToExtract[frameIndex]);
                    } else {
                        // All frames extracted
                        URL.revokeObjectURL(objectUrl);
                        resolve(frames.length > 0 ? frames : []);
                    }
                } catch (error) {
                    URL.revokeObjectURL(objectUrl);
                    reject(error);
                }
            };

            video.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Failed to load video'));
            };

            // Timeout fallback
            setTimeout(() => {
                if (frames.length === 0) {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error('Video loading timeout'));
                }
            }, 30000); // 30 second timeout
        });
    };

    const handleAnalyzeVideo = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!prompt.trim() && !video) || isAnalyzing) return;

        setIsAnalyzing(true);

        const handleError = () => {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: 'assistant',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
                };
                return updated;
            });
        };

        try {
            // Extract frames from video if present
            let extractedFrames: string[] = [];
            const videoPreview = video?.preview;
            if (video) {
                extractedFrames = await extractVideoFrames(video.file);
            }

            // Prepare user message
            const inputText = prompt.trim() || 'What\'s in this video?';
            const userMessage: ChatMessage = {
                role: 'user',
                content: inputText,
                ...(extractedFrames.length > 0 && {
                    // Send first frame as imageUrl for API analysis
                    imageUrl: extractedFrames[0],
                    // Store video URL for display (to show video player in chat)
                    videoUrl: videoPreview
                })
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setPrompt('');
            resetHeight();
            setVideo(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Add placeholder for assistant response
            const assistantMessageIndex = newMessages.length;
            setMessages([...newMessages, { role: 'assistant', content: '' }]);

            // Call API
            await streamChat({
                endpoint: API_ENDPOINTS.videoAnalyze,
                messages: newMessages,
                onChunk: (content) => {
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[assistantMessageIndex] = {
                            role: 'assistant',
                            content: content
                        };
                        return updated;
                    });
                },
                onError: handleError
            });
        } catch (error) {
            console.error('Error analyzing video:', error);
            handleError();
        } finally {
            setIsAnalyzing(false);
        }
    };

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
                    <header className="h-20 flex items-center justify-between px-2 sm:px-0 bg-transparent sticky top-0 z-10 border-b border-border/40 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <Video className="w-6 h-6 text-primary" />
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Video Analysis AI</h1>
                                <p className="text-xs text-muted-foreground">Upload video, ask questions, get insights</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Powered by NEON.AI</span>
                        </div>
                    </header>

                    <div className="py-8 space-y-8">
                        <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden min-h-[60vh] flex flex-col">
                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-8">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10">
                                            <Video className="w-10 h-10 text-primary" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-4 max-w-2xl">
                                            <h2 className="text-3xl font-bold tracking-tight text-foreground">Video Analysis AI</h2>
                                            <p className="text-base text-muted-foreground">
                                                Upload a video and get detailed analysis, descriptions, and answers to your questions.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                                            <Card
                                                className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                                onClick={() => {
                                                    fileInputRef.current?.click();
                                                }}
                                            >
                                                <CardContent className="p-0 px-4">
                                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                                        Analyze Video Content
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card
                                                className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                                onClick={() => {
                                                    setPrompt('What actions or activities are happening in this video?');
                                                    setTimeout(() => textareaRef.current?.focus(), 150);
                                                }}
                                            >
                                                <CardContent className="p-0 px-4">
                                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                                        Identify Actions
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card
                                                className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                                onClick={() => {
                                                    setPrompt('Describe this video in detail');
                                                    setTimeout(() => textareaRef.current?.focus(), 150);
                                                }}
                                            >
                                                <CardContent className="p-0 px-4">
                                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                                        Detailed Description
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            <Card
                                                className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                                onClick={() => {
                                                    setPrompt('What is the mood or atmosphere of this video?');
                                                    setTimeout(() => textareaRef.current?.focus(), 150);
                                                }}
                                            >
                                                <CardContent className="p-0 px-4">
                                                    <p className="text-sm font-medium text-foreground leading-relaxed">
                                                        Analyze Mood
                                                    </p>
                                                </CardContent>
                                            </Card>
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
                                )}
                            </div>
                        </div>
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
                    footerClassName="bg-background/95 backdrop-blur-sm border-t border-border/40"
                    textareaClassName="min-h-[60px] max-h-[200px] pr-12"
                    submitDisabled={(!prompt.trim() && !video) || isAnalyzing}
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
                        <>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="video"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                                disabled={isAnalyzing}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isAnalyzing}
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                        </>
                    }
                    hint={
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            Video Analysis AI may provide information that should be verified for accuracy.
                        </p>
                    }
                />
            </AsideInset>
        </AsideLayout>
    );
}

