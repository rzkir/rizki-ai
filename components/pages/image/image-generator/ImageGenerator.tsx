'use client';

import { useState } from 'react';
import { Sparkles, Download, Loader2, ArrowUp, ImageIcon, Palette, Mountain, Zap, Wand2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';

type Resolution = {
    width: number;
    height: number;
    label: string;
};

const RESOLUTIONS: Resolution[] = [
    { width: 512, height: 512, label: '512x512 (Square)' },
    { width: 768, height: 768, label: '768x768 (Square)' },
    { width: 1024, height: 1024, label: '1024x1024 (Square)' },
    { width: 1024, height: 768, label: '1024x768 (Landscape)' },
    { width: 768, height: 1024, label: '768x1024 (Portrait)' },
    { width: 1920, height: 1080, label: '1920x1080 (HD)' },
];

const SUGGESTED_PROMPTS = [
    { icon: Sparkles, text: "Futuristic City", prompt: "A futuristic city with flying cars, neon lights, and tall skyscrapers at night" },
    { icon: ImageIcon, text: "Portrait Art", prompt: "A professional portrait of a person with dramatic lighting, photorealistic style" },
    { icon: Palette, text: "Abstract Art", prompt: "Abstract art with vibrant colors, geometric shapes, and flowing patterns" },
    { icon: Mountain, text: "Nature Scene", prompt: "A serene mountain landscape at sunset with a lake reflecting the sky" },
    { icon: Zap, text: "Sci-Fi Scene", prompt: "A science fiction scene with advanced technology, space station, and alien planets" },
    { icon: Sparkles, text: "Fantasy World", prompt: "A magical fantasy world with dragons, castles, and mystical creatures" },
];

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [resolution, setResolution] = useState<Resolution>(RESOLUTIONS[2]); // Default 1024x1024
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
                body: JSON.stringify({
                    prompt,
                    width: resolution.width,
                    height: resolution.height,
                }),
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
        <section className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            {/* Background Gradient Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="flex-1 overflow-y-auto relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {!imageUrl ? (
                        <div className="space-y-12">
                            {/* Header */}
                            <div className="space-y-4 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-4">
                                    <Wand2 className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Describe Your Vision
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Transform your imagination into stunning visuals with AI-powered image generation
                                </p>
                            </div>

                            {/* Resolution Selector */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                    <label className="text-sm font-semibold text-foreground px-4">
                                        Output Resolution
                                    </label>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {RESOLUTIONS.map((res) => {
                                        const isSelected = resolution.width === res.width && resolution.height === res.height;
                                        return (
                                            <button
                                                key={`${res.width}x${res.height}`}
                                                onClick={() => setResolution(res)}
                                                disabled={isLoading}
                                                className={`group relative rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-5 min-h-[110px] backdrop-blur-sm ${isSelected
                                                    ? 'border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/20 scale-105'
                                                    : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-accent/30 hover:scale-102 hover:shadow-md'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                                            >
                                                {isSelected && (
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                                                    </div>
                                                )}
                                                <p className={`font-bold text-base transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                                                    }`}>
                                                    {res.width}×{res.height}
                                                </p>
                                                <p className={`text-xs font-medium transition-colors ${isSelected ? 'text-primary/80' : 'text-muted-foreground group-hover:text-primary/70'
                                                    }`}>
                                                    {res.label.split('(')[1]?.replace(')', '') || 'Square'}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                    💡 Higher resolution requires more processing time
                                </p>
                            </div>

                            {/* Suggested Prompts */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                    <label className="text-sm font-semibold text-foreground px-4">
                                        Suggested Prompts
                                    </label>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {SUGGESTED_PROMPTS.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPrompt(item.prompt)}
                                            disabled={isLoading}
                                            className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-accent/30 p-5 transition-all duration-300 flex items-start gap-4 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg"
                                        >
                                            <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                <item.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <span className="font-semibold text-sm text-foreground block mb-1 group-hover:text-primary transition-colors">
                                                    {item.text}
                                                </span>
                                                <span className="text-xs text-muted-foreground line-clamp-2">
                                                    {item.prompt}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 py-4">
                            {/* Image Preview */}
                            <div className="group">
                                <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                                    {/* Image Container */}
                                    <div className="relative w-full aspect-square bg-gradient-to-br from-muted/20 via-muted/10 to-transparent">
                                        <Image
                                            src={imageUrl}
                                            alt={prompt || 'Generated image'}
                                            fill
                                            className="object-contain p-4"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-6 border-t border-border/50 bg-card/80 backdrop-blur-sm space-y-3">
                                        <Button
                                            onClick={handleDownload}
                                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <Download className="w-5 h-5 mr-2" />
                                            Download Image
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setImageUrl('');
                                                setPrompt('');
                                            }}
                                            variant="outline"
                                            className="w-full h-12 text-base font-semibold border-2 hover:bg-accent/50 transition-all"
                                        >
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Generate New Image
                                        </Button>
                                    </div>

                                    {/* Info Section */}
                                    {prompt && (
                                        <div className="p-6 border-t border-border/50 bg-muted/20 backdrop-blur-sm space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <Wand2 className="w-3.5 h-3.5" />
                                                    Prompt Used
                                                </p>
                                                <p className="text-sm text-foreground leading-relaxed bg-card/50 rounded-lg p-4 border border-border/30">
                                                    {prompt}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    Resolution
                                                </span>
                                                <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                                                    {resolution.width} × {resolution.height}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-5xl mx-auto p-4 sm:p-6">
                    <div className="relative">
                        <div className="flex items-end gap-3 rounded-2xl border-2 border-border/50 bg-card/50 backdrop-blur-sm p-4 shadow-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <div className="flex-1 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Describe the image you want to generate... (Press Enter to generate)"
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent text-foreground resize-none min-h-[70px] max-h-40 py-2 px-3 focus:outline-none placeholder:text-muted-foreground/60 disabled:opacity-50 text-base leading-relaxed"
                                    rows={1}
                                />
                            </div>
                            <Button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || isLoading}
                                size="lg"
                                className="h-12 w-12 rounded-xl shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <ArrowUp className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
