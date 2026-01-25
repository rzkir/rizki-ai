'use client';

import { Sparkles, Download, ArrowUp, Wand2, Check, History, X, Clock, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import Image from 'next/image';

import { Sidebar } from '@/components/ui/sidebar/Sidebar';

import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';

import { InputArea } from '@/components/ui/input-area/InputArea';

import { useStateImageGenerator } from './lib/useStateImageGenerator';

import { useTextareaRef } from '@/hooks/text-areaRef';

export default function ImageGenerator() {
    const {
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
        handleGenerate,
        handleDownload,
        handleKeyPress,
        handleViewHistory,
        handleRemoveHistory,
        RESOLUTIONS,
        SUGGESTED_PROMPTS,
    } = useStateImageGenerator();

    const { textareaRef, resetHeight } = useTextareaRef({
        input: prompt,
        maxHeight: 144, // max-h-36 = 144px
    });

    /* History items content */
    const historyContent = (
        <div className="space-y-3">
            {history.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent rounded-full animate-pulse" />
                        <div className="relative w-full h-full rounded-full bg-linear-to-br from-muted/50 to-muted/20 flex items-center justify-center border border-border/50">
                            <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Belum ada riwayat</p>
                    <p className="text-xs text-muted-foreground/60 mt-1 max-w-50 mx-auto">
                        Gambar yang kamu generate akan tersimpan di sini
                    </p>
                </div>
            ) : (
                history.map((item, index) => (
                    <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleViewHistory(item)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleViewHistory(item);
                            }
                        }}
                        style={{ animationDelay: `${index * 50}ms` }}
                        className="w-full group text-left rounded-2xl border border-transparent bg-linear-to-br from-sidebar-accent/80 to-sidebar-accent/40 hover:from-primary/15 hover:to-primary/5 hover:border-primary/30 p-3 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-2"
                    >
                        <div className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-300">
                                <Image
                                    src={item.imageUrl}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="64px"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="flex-1 min-w-0 py-0.5">
                                <p className="text-xs text-sidebar-foreground font-medium line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                    {item.prompt}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                        {item.resolution.width}×{item.resolution.height}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 hover:scale-110"
                                onClick={(e) => handleRemoveHistory(item.id, e)}
                                aria-label="Hapus dari riwayat"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <AsideLayout>
            {/* Sidebar */}
            <Sidebar
                header={{
                    icon: History,
                    title: 'Riwayat Kreasi',
                    subtitle: `${history.length} hasil tersimpan`,
                    badge: <Clock className="w-3 h-3" />,
                }}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                mobileIcon={History}
                mobileBadge={history.length}
            >
                {historyContent}
            </Sidebar>

            {/* Main Content Area */}
            <AsideInset>
                <AsideMain>
                    {!imageUrl ? (
                        <div className="space-y-10">
                            {/* Hero Section */}
                            <div className="space-y-4 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20">
                                    <Wand2 className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Describe Your Vision
                                </h2>
                                <p className="text-muted-foreground max-w-xl mx-auto">
                                    Transform your imagination into stunning visuals with AI-powered image generation.
                                </p>
                                <p className="text-sm text-muted-foreground/80 lg:hidden">
                                    Tap ikon Riwayat untuk melihat hasil generate sebelumnya.
                                </p>
                            </div>

                            {/* Resolution Selector */}
                            <div className="space-y-4">
                                <AsideSectionDivider>Output Resolution</AsideSectionDivider>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {RESOLUTIONS.map((res) => {
                                        const isSelected = resolution.width === res.width && resolution.height === res.height;
                                        return (
                                            <button
                                                key={`${res.width}x${res.height}`}
                                                onClick={() => setResolution(res)}
                                                disabled={isLoading}
                                                className={`group relative rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 p-4 min-h-25 ${isSelected
                                                    ? 'border-primary bg-primary/10 shadow-md'
                                                    : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-accent/30'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {isSelected && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-primary-foreground" />
                                                    </div>
                                                )}
                                                <p className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>{res.width}×{res.height}</p>
                                                <p className="text-[10px] text-muted-foreground">{res.label.split('(')[1]?.replace(')', '') || ''}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-center text-muted-foreground">💡 Higher resolution = more processing time</p>
                            </div>

                            {/* Suggested Prompts */}
                            <div className="space-y-4">
                                <AsideSectionDivider>Suggested Prompts</AsideSectionDivider>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {SUGGESTED_PROMPTS.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPrompt(item.prompt)}
                                            disabled={isLoading}
                                            className="group rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-accent/30 p-4 transition-all flex items-start gap-4 text-left disabled:opacity-50"
                                        >
                                            <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                                                <item.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-semibold text-sm text-foreground block mb-1 group-hover:text-primary">{item.text}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-2">{item.prompt}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                                <div className="relative w-full aspect-square bg-linear-to-br from-muted/20 to-transparent">
                                    <Image
                                        src={imageUrl}
                                        alt={prompt || 'Generated image'}
                                        fill
                                        className="object-contain p-4"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                                </div>
                                <div className="p-6 border-t border-border/50 space-y-3">
                                    <Button
                                        onClick={handleDownload}
                                        className="w-full h-12 font-semibold bg-primary hover:bg-primary/90"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Image
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setImageUrl('');
                                            setPrompt('');
                                            resetHeight();
                                        }}
                                        variant="outline"
                                        className="w-full h-12 font-semibold"
                                    >
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate New Image
                                    </Button>
                                </div>
                                {prompt && (
                                    <div className="p-6 border-t border-border/50 bg-muted/20 space-y-4">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                            <Wand2 className="w-3.5 h-3.5" /> Prompt Used
                                        </p>
                                        <p className="text-sm text-foreground bg-card/50 rounded-lg p-4 border border-border/30">{prompt}</p>
                                        <div className="flex justify-between items-center pt-3 border-t border-border/30">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">Resolution</span>
                                            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                                                {resolution.width} × {resolution.height}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </AsideMain>

                {/* Input Area (fixed bottom) */}
                <InputArea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onSubmit={handleGenerate}
                    placeholder="Describe the image you want to generate... (Enter to generate)"
                    disabled={isLoading}
                    isLoading={isLoading}
                    icon={Sparkles}
                    submitIcon={ArrowUp}
                    textareaRef={textareaRef}
                />
            </AsideInset>
        </AsideLayout>
    );
}