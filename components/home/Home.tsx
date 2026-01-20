"use client";

import { useState, useEffect } from 'react';

import { Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';


const TypingAnimation = ({ prompts }: { prompts: string[] }) => {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const currentPrompt = prompts[currentPromptIndex];

        if (!isDeleting && displayedText === currentPrompt) {
            // Wait before deleting
            const deleteTimeout = setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
            return () => clearTimeout(deleteTimeout);
        }

        if (isDeleting && displayedText === '') {
            // Move to next prompt
            const nextPromptTimeout = setTimeout(() => {
                setIsDeleting(false);
                setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
                setTypingSpeed(150);
            }, 100);
            return () => clearTimeout(nextPromptTimeout);
        }

        const timeout = setTimeout(() => {
            if (isDeleting) {
                setDisplayedText(currentPrompt.substring(0, displayedText.length - 1));
                setTypingSpeed(50); // Faster when deleting
            } else {
                setDisplayedText(currentPrompt.substring(0, displayedText.length + 1));
                setTypingSpeed(150);
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentPromptIndex, prompts, typingSpeed]);

    return (
        <div className="relative inline-block">
            <span className="text-primary font-medium">{displayedText}</span>
            <span className="animate-pulse text-primary ml-1">|</span>
        </div>
    );
};


export default function Home() {
    const examplePrompts = [
        "Buatkan kode React untuk komponen button yang modern",
        "Generate gambar landscape futuristik dengan AI",
        "Jelaskan konsep machine learning secara sederhana",
        "Bantu saya membuat business plan untuk startup",
        "Terjemahkan dokumen dari bahasa Inggris ke Indonesia",
        "Analisis video dan berikan ringkasan kontennya"
    ];
    return (
        <section className="relative min-h-full md:min-h-screen py-20 sm:py-32 lg:py-40 overflow-hidden">
            {/* Minimal, clean background */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
                <div className="absolute -top-24 -left-16 h-[420px] w-[420px] rounded-full blur-[110px] bg-primary/18 opacity-70" />
                <div className="absolute bottom-[-180px] right-[-60px] h-[500px] w-[500px] rounded-full blur-[130px] bg-emerald-400/14 opacity-60" />
            </div>

            {/* Subtle vignette + twin light lines */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)] mix-blend-multiply" />
                <div className="absolute inset-x-12 top-16 h-64 rounded-full bg-white/4 dark:bg-white/3 blur-3xl" />
                <div className="absolute inset-y-0 left-1/3 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-primary/28 to-transparent opacity-70" />
                <div className="absolute inset-y-0 right-1/3 w-px translate-x-1/2 bg-linear-to-b from-transparent via-primary/28 to-transparent opacity-70" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                        <Sparkles className="mr-2 h-3.5 w-3.5 animate-pulse" />
                        Powered by Advanced AI
                    </Badge>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                        <span className="block">Transform Your Ideas</span>
                        <span className="block mt-2 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                            With AI Magic
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        Experience the power of artificial intelligence across multiple domains.
                        From coding to creativity, health to business—everything you need in one platform.
                    </p>

                    {/* Typing Animation Section */}
                    <div className="mb-8 max-w-3xl mx-auto">
                        <Card className="border border-border bg-card shadow-sm shadow-primary/5 hover:shadow-primary/10 transition-shadow duration-300">
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.4)]">
                                        <Sparkles className="h-5 w-5 text-primary drop-shadow-[0_0_6px_rgba(var(--primary),0.6)]" />
                                    </div>
                                    <div className="flex-1 min-h-[60px] flex items-center">
                                        <div className="text-base sm:text-lg text-foreground">
                                            <TypingAnimation prompts={examplePrompts} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
