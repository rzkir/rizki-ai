'use client';

import { Metadata } from 'next';
import { useState } from 'react';

import { imageMetadata } from '@/helper/meta/Metadata';

export const metadata: Metadata = imageMetadata


import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function ImageGenerationPage() {
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = async () => {
        if (!prompt.trim() || isGenerating) return;

        setIsGenerating(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            const data = await response.json();

            if (data.imageUrl) {
                setGeneratedImage(data.imageUrl);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            if (error instanceof Error) {
                setError(error.message || 'An error occurred while generating the image.');
            } else {
                setError('An error occurred while generating the image.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Image Generation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="prompt">Image Prompt</Label>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the image you want to generate..."
                                className="min-h-30"
                                disabled={isGenerating}
                            />
                        </div>

                        <Button
                            onClick={handleGenerateImage}
                            disabled={!prompt.trim() || isGenerating}
                            className="w-full md:w-auto"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Generate Image
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

                        {generatedImage && !error && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-3">Generated Image</h3>
                                <div className="border rounded-lg overflow-hidden max-w-lg mx-auto">
                                    <Image
                                        src={generatedImage.trim()}
                                        alt="Generated image"
                                        width={512}
                                        height={512}
                                        className="w-full h-auto"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}