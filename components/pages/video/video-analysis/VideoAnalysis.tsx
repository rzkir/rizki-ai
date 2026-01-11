'use client';

import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent } from '@/components/ui/card';

import { Loader2, User, MessageSquare, Upload, X, Video, Send } from 'lucide-react';

import { MarkdownRenderer } from '@/components/markdown-renderer';

import { streamChat } from '@/lib/api-client';

import { API_ENDPOINTS } from '@/lib/config';

import { useTextareaRef } from '@/hooks/text-areaRef';

export default function VideoAnalysisPage() {
    const [prompt, setPrompt] = useState('');
    const [video, setVideo] = useState<{ file: File; preview: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { textareaRef, resetHeight } = useTextareaRef({ input: prompt });

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
        if (e) e.preventDefault();
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
            const userMessage: Message = {
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
        <div className="flex flex-col min-h-screen bg-background">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                        <div className="max-w-4xl w-full space-y-8 flex flex-col items-center">
                            {/* Video Icon */}
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Video className="w-16 h-16 text-foreground opacity-80" strokeWidth={1.5} />
                            </div>

                            {/* Welcome Message */}
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                                    Video Analysis AI
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Upload a video and get detailed analysis, descriptions, and answers to your questions
                                </p>
                            </div>

                            {/* Suggested Actions */}
                            <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
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
                                    onClick={() => setPrompt('What actions or activities are happening in this video?')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Identify Actions
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setPrompt('Describe this video in detail')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Detailed Description
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setPrompt('What is the mood or atmosphere of this video?')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Analyze Mood
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
                <form onSubmit={handleAnalyzeVideo} className="max-w-3xl mx-auto">
                    {/* Video Upload Section */}
                    {video && (
                        <div className="mb-3 flex items-center gap-3">
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
                    )}
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 relative">
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
                            <Textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={video ? "Ask a question about the video..." : "Upload a video and ask questions..."}
                                className="min-h-[60px] max-h-[200px] resize-none bg-card border border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 pl-10 pr-12 text-foreground placeholder:text-muted-foreground placeholder:text-sm overflow-y-auto"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAnalyzeVideo(e);
                                    }
                                }}
                                disabled={isAnalyzing}
                                rows={1}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={(!prompt.trim() && !video) || isAnalyzing}
                                className="shrink-0 w-10 h-10 rounded-full bg-transparent hover:bg-sidebar-accent text-foreground p-0"
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        Video Analysis AI may provide information that should be verified for accuracy.
                    </p>
                </form>
            </div>
        </div>
    );
}

