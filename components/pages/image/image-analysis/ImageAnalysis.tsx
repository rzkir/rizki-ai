'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User, MessageSquare, Upload, X, Scan, Send } from 'lucide-react';
import Image from 'next/image';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { streamChat } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';
import { useTextareaRef } from '@/hooks/text-areaRef';

export default function ImageAnalysisPage() {
    const [prompt, setPrompt] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { textareaRef, resetHeight } = useTextareaRef({ input: prompt });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Please select an image smaller than 10MB');
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAnalyzeImage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((!prompt.trim() && !selectedImage) || isAnalyzing) return;

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
            // Convert image to base64 if present
            let imageBase64: string | undefined;
            if (selectedImage) {
                imageBase64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = (reader.result as string).split(',')[1];
                        resolve(`data:image/${selectedImage.type.split('/')[1]};base64,${base64}`);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedImage);
                });
            }

            // Prepare user message
            const inputText = prompt.trim() || 'What\'s in this image?';
            const userMessage: Message = {
                role: 'user',
                content: inputText,
                ...(imageBase64 && { imageUrl: imageBase64 })
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setPrompt('');
            resetHeight();
            setSelectedImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Add placeholder for assistant response
            const assistantMessageIndex = newMessages.length;
            setMessages([...newMessages, { role: 'assistant', content: '' }]);

            // Call API
            await streamChat({
                endpoint: API_ENDPOINTS.imageAnalyze,
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
            console.error('Error analyzing image:', error);
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
                            {/* Scan Icon */}
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Scan className="w-16 h-16 text-foreground opacity-80" strokeWidth={1.5} />
                            </div>

                            {/* Welcome Message */}
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                                    Image Analysis AI
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Upload an image and get detailed analysis, descriptions, and answers to your questions
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
                                            Analyze Image Content
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setPrompt('What objects are in this image?')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Identify Objects
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setPrompt('Describe this image in detail')}
                                >
                                    <CardContent className="p-0 px-4">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            Detailed Description
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/50 py-4"
                                    onClick={() => setPrompt('What is the mood or atmosphere of this image?')}
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
                                            {message.imageUrl && (
                                                <div className="mb-2">
                                                    <Image
                                                        src={message.imageUrl}
                                                        alt="Uploaded"
                                                        width={300}
                                                        height={300}
                                                        className="rounded-lg object-contain max-h-64 w-auto"
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
                <form onSubmit={handleAnalyzeImage} className="max-w-3xl mx-auto">
                    {/* Image Upload Section */}
                    {selectedImage && imagePreview && (
                        <div className="mb-3 flex items-center gap-3">
                            <div className="relative inline-block">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover border border-border/60"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border hover:bg-muted text-foreground"
                                    onClick={handleRemoveImage}
                                    disabled={isAnalyzing}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground truncate flex-1">{selectedImage.name}</p>
                        </div>
                    )}
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 relative">
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isAnalyzing}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 bottom-2 h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isAnalyzing}
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                            <Textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={selectedImage ? "Ask a question about the image..." : "Upload an image and ask questions..."}
                                className="min-h-[60px] max-h-[200px] resize-none bg-card border border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 pl-10 pr-12 text-foreground placeholder:text-muted-foreground placeholder:text-sm overflow-y-auto"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAnalyzeImage(e);
                                    }
                                }}
                                disabled={isAnalyzing}
                                rows={1}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={(!prompt.trim() && !selectedImage) || isAnalyzing}
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
                        Image Analysis AI may provide information that should be verified for accuracy.
                    </p>
                </form>
            </div>
        </div>
    );
}

