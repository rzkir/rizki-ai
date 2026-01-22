"use client";

import { ArrowUp, Upload, ImageIcon, Loader2, Sparkles } from "lucide-react";
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Sidebar } from '@/components/ui/sidebar/Sidebar';
import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';
import { InputArea } from '@/components/ui/input-area/InputArea';
import { useStateImageAnalysis } from './lib/useStateImageAnalysis';
import Image from 'next/image';

export default function ImageAnalysisPage() {
  const {
    selectedImage,
    analysis,
    isLoading,
    prompt,
    setPrompt,
    sheetOpen,
    setSheetOpen,
    isListening,
    isSpeechSupported,
    suggestedPrompts,
    fileInputRef,
    textareaRef,
    handleImageSelect,
    handleAnalyze,
    handleReset,
    toggleVoiceRecognition,
  } = useStateImageAnalysis();

  return (
    <AsideLayout>
      <Sidebar
        header={{
          icon: ImageIcon,
          title: 'Image Analyzer',
          subtitle: 'Visual intelligence engine',
        }}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mobileIcon={ImageIcon}
      >
        <div className="space-y-6">
          <AsideSectionDivider>Suggestions</AsideSectionDivider>
        </div>
      </Sidebar>

      <AsideInset>
        <AsideMain maxWidth="6xl">
          <div className="py-8 space-y-8">
            {!selectedImage ? (
              <div className="space-y-12 py-6">
                <div className="space-y-4 text-center">
                  <h2 className="text-5xl font-black tracking-tighter leading-none bg-linear-to-br from-white via-white to-primary/50 bg-clip-text text-transparent">
                    Upload an image <br /> to <span className="gradient-text-purple-blue italic">analyze</span>
                  </h2>

                  <p className="text-base text-muted-foreground">
                    Leverage advanced computer vision to extract insights from your images instantly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
                  {suggestedPrompts.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(item.prompt);
                        if (!selectedImage) {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="w-full group flex items-start gap-3 rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 hover:border-primary/40 hover:bg-primary/10 transition-all p-3 text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary/15 text-primary">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-sidebar-foreground group-hover:text-primary">{item.text}</p>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2">{item.prompt}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Upload Area */}
                <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer">
                  <div className="absolute -inset-1 bg-linear-to-r from-primary to-chart-3 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                  <div className="relative bg-card/40 backdrop-blur-xl border-2 border-dashed border-border/50 rounded-[2rem] p-16 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all hover:bg-card/60 group">
                    <Upload className="w-16 h-16 text-primary/60 group-hover:text-primary transition-colors" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground mb-1">Drop your image here</p>
                      <p className="text-sm text-muted-foreground">or click to browse from your device</p>
                    </div>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-4">
                {/* Image Preview */}
                <div className="lg:col-span-1">
                  <div className="sticky top-28 rounded-[2rem] overflow-hidden border border-border/50 bg-card/40 backdrop-blur-xl p-2 shadow-2xl">
                    <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden">
                      <Image
                        src={selectedImage}
                        alt="Selected"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-full mt-4 px-4 py-3 text-sm font-medium rounded-xl bg-destructive/20 hover:bg-destructive/30 text-destructive transition-all"
                    >
                      Upload Different Image
                    </button>
                  </div>
                </div>

                {/* Analysis Panel */}
                <div className="lg:col-span-2 space-y-6">
                  {analysis && (
                    <div className="rounded-[2rem] bg-card border border-border/50 backdrop-blur-md p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-chart-3 shrink-0 mt-1" />
                        <div className="space-y-2 flex-1">
                          <h3 className="font-bold text-foreground">Analysis Results</h3>
                          <div className="text-foreground prose prose-sm max-w-none prose-invert">
                            <MarkdownRenderer content={analysis} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!analysis && !isLoading && (
                    <div className="rounded-[2rem] bg-card/40 border-2 border-dashed border-border/50 p-8 flex items-center justify-center min-h-[300px]">
                      <p className="text-center text-muted-foreground">
                        Enter a prompt atau klik &quot;Analyze&quot; untuk insight gambar
                      </p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="rounded-[2rem] bg-card border border-border/50 backdrop-blur-md p-8 flex items-center justify-center min-h-[300px]">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-muted-foreground">Analyzing image...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </AsideMain>

        <InputArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
          onSubmit={handleAnalyze}
          placeholder={selectedImage ? "Ask something about the image..." : "Upload an image first..."}
          disabled={!selectedImage || isLoading}
          isLoading={isLoading}
          submitIcon={ArrowUp}
          textareaRef={textareaRef}
          maxWidth="6xl"
          isListening={isListening}
          isSpeechSupported={isSpeechSupported}
          onVoiceToggle={toggleVoiceRecognition}
        />
      </AsideInset>
    </AsideLayout>
  );
}
