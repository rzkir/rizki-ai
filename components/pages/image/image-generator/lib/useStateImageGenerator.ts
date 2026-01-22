'use client';

import { ImageIcon, Palette, Mountain, Zap, Sparkles } from 'lucide-react';

import { useState } from 'react';

import { toast } from 'sonner';

export function useStateImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [resolution, setResolution] = useState<Resolution>({ width: 1024, height: 1024, label: '1024x1024 (Square)' });
    const [isLoading, setIsLoading] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

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
                const url = data.imageUrl;
                setImageUrl(url);
                setSheetOpen(false);
                setHistory((prev) => [
                    { id: crypto.randomUUID(), prompt, imageUrl: url, resolution: { ...resolution }, createdAt: Date.now() },
                    ...prev,
                ].slice(0, 50));
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

    const handleViewHistory = (item: HistoryItem) => {
        setImageUrl(item.imageUrl);
        setPrompt(item.prompt);
        setResolution(item.resolution);
        setSheetOpen(false);
    };

    const handleRemoveHistory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHistory((prev) => prev.filter((h) => h.id !== id));
        toast.success('Dihapus dari riwayat');
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

    return {
        // state
        prompt,
        setPrompt,
        imageUrl,
        setImageUrl,
        resolution,
        setResolution,
        isLoading,
        sheetOpen,
        setSheetOpen,
        history,
        // handlers
        handleGenerate,
        handleDownload,
        handleKeyPress,
        handleViewHistory,
        handleRemoveHistory,
        RESOLUTIONS,
        SUGGESTED_PROMPTS,
    };
}
