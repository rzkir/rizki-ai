'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Loader2, AlertCircle, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { streamChat } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';

export default function ImageAnalysisPage() {
    const [prompt, setPrompt] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            setError(null);

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

    const handleAnalyzeImage = async () => {
        if ((!prompt.trim() && !selectedImage) || isAnalyzing) return;

        setIsAnalyzing(true);
        setError(null);

        const handleError = (errorMessage?: string) => {
            setError(errorMessage || 'An error occurred while analyzing the image.');
            // Remove the placeholder assistant message on error
            setMessages(prev => prev.slice(0, -1));
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
            const userMessage: Message = {
                role: 'user',
                content: prompt.trim() || 'What\'s in this image?',
                ...(imageBase64 && { imageUrl: imageBase64 })
            };

            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setPrompt('');
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
                endpoint: API_ENDPOINTS.image,
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
                onError: (error) => handleError(error)
            });
        } catch (error) {
            console.error('Error analyzing image:', error);
            if (error instanceof Error) {
                handleError(error.message);
            } else {
                handleError();
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Image Analysis with Mistral AI
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Upload Image</Label>
                            <div className="flex items-center gap-4">
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
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isAnalyzing}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Choose Image
                                </Button>
                                {imagePreview && (
                                    <div className="relative inline-block">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="rounded-lg object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                            onClick={handleRemoveImage}
                                            disabled={isAnalyzing}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prompt Section */}
                        <div className="space-y-2">
                            <Label htmlFor="prompt">Question about the image (optional)</Label>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask a question about the image, or leave empty to get a general description..."
                                className="min-h-24"
                                disabled={isAnalyzing}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAnalyzeImage();
                                    }
                                }}
                            />
                        </div>

                        <Button
                            onClick={handleAnalyzeImage}
                            disabled={(!prompt.trim() && !selectedImage) || isAnalyzing}
                            className="w-full md:w-auto"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Analyze Image
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-medium text-red-800 mb-1">Error</h4>
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Messages Section */}
                        {messages.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <h3 className="text-lg font-medium">Conversation</h3>
                                <div className="border rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto bg-muted/50">
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'
                                                }`}
                                        >
                                            <div
                                                className={`rounded-lg p-3 max-w-[80%] ${msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-background border'
                                                    }`}
                                            >
                                                {msg.imageUrl && (
                                                    <div className="mb-2">
                                                        <Image
                                                            src={msg.imageUrl}
                                                            alt="Uploaded"
                                                            width={200}
                                                            height={200}
                                                            className="rounded-lg object-contain max-h-48"
                                                        />
                                                    </div>
                                                )}
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

