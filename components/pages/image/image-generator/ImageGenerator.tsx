'use client';

import { useState } from 'react';
import { Sparkles, Download, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error('Silakan masukkan prompt untuk generate gambar');
            return;
        }

        setIsLoading(true);
        setImageUrl('');

        try {
            const response = await fetch('/api/image/genrate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image');
            }

            if (data.success && data.imageUrl) {
                setImageUrl(data.imageUrl);
                toast.success('Gambar berhasil di-generate!');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal generate gambar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!imageUrl) return;

        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Gambar berhasil diunduh!');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl w-full mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Image Generator</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Generate gambar dengan AI dari deskripsi Anda
                    </p>
                </div>

                {/* Input Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Deskripsi Gambar</CardTitle>
                        <CardDescription>
                            Deskripsikan gambar yang ingin Anda buat dengan detail
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Contoh: A futuristic city with flying cars, neon lights, and tall skyscrapers at night"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyPress}
                            rows={4}
                            className="resize-none"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Image
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Result Card */}
                {(imageUrl || isLoading) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Hasil Generate</CardTitle>
                            {imageUrl && (
                                <CardDescription>
                                    Prompt: {prompt}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                                    <p className="text-muted-foreground">Generating your image...</p>
                                </div>
                            ) : imageUrl ? (
                                <div className="space-y-4">
                                    <div className="relative rounded-lg overflow-hidden border">
                                        <img
                                            src={imageUrl}
                                            alt={prompt}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleDownload}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Image
                                    </Button>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!imageUrl && !isLoading && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
                            <ImageIcon className="w-16 h-16 text-muted-foreground opacity-50" strokeWidth={1.5} />
                            <p className="text-muted-foreground text-center">
                                Gambar yang di-generate akan muncul di sini
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
