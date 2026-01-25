"use client";

import { ArrowUp, Upload, ImageIcon, Loader2, Sparkles, User } from "lucide-react";
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Sidebar } from '@/components/ui/sidebar/Sidebar';
import { AsideLayout, AsideInset, AsideMain, AsideSectionDivider } from '@/components/ui/aside/Aside';
import { InputArea } from '@/components/ui/input-area/InputArea';
import { useStateImageAnalysis } from './lib/useStateImageAnalysis';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function ImageAnalysisPage() {
  const {
    selectedImage,
    messages,
    isLoading,
    prompt,
    setPrompt,
    sheetOpen,
    setSheetOpen,
    isListening,
    isSpeechSupported,
    historyItems,
    suggestedPrompts,
    fileInputRef,
    textareaRef,
    handleImageSelect,
    handleAnalyze,
    handleReset,
    handleHistoryClick,
    toggleVoiceRecognition,
  } = useStateImageAnalysis();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          <AsideSectionDivider>Riwayat</AsideSectionDivider>
          {historyItems.length === 0 ? (
            <p className="text-xs text-muted-foreground">Belum ada riwayat analisis gambar.</p>
          ) : (
            <div className="space-y-2">
              {[...historyItems].reverse().map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-sidebar-border/50 bg-sidebar-accent/50 px-4 py-3 text-sm text-sidebar-foreground line-clamp-2 cursor-pointer hover:bg-sidebar-accent transition-colors"
                  title={item.content}
                  onClick={() => handleHistoryClick(item.content)}
                >
                  {item.content}
                </div>
              ))}
            </div>
          )}
          <AsideSectionDivider>Suggestions</AsideSectionDivider>
        </div>
      </Sidebar>

      <AsideInset>
        <AsideMain maxWidth="6xl">
          <div className="py-6 space-y-8">
            {!selectedImage ? (
              <div className="space-y-12">
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
                <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer max-w-4xl mx-auto">
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
            ) : messages.length === 0 ? (
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
                <div className="lg:col-span-2">
                  {!isLoading && (
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
            ) : (
              <div className="py-4">
                {/* Analysis Panel */}
                <div className="w-full">
                  <div className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden min-h-[60vh] flex flex-col">
                    <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2 border-b border-border/30">
                      <h3 className="text-sm font-semibold text-foreground">Image Analysis</h3>
                      <button
                        onClick={handleReset}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive/20 hover:bg-destructive/30 text-destructive transition-all"
                      >
                        Upload Different Image
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                      <div className="space-y-3 sm:space-y-4 md:space-y-6">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex gap-2 sm:gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                                <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-sm ${message.role === 'user'
                                ? 'bg-card border border-border/40 text-foreground'
                                : 'bg-muted/30 border border-border/30 text-foreground'
                                }`}
                            >
                              {message.role === 'user' ? (
                                <div className="space-y-2">
                                  {message.imageUrl && index === 0 && (
                                    <div className="mb-2">
                                      <Image
                                        src={message.imageUrl}
                                        alt="User image"
                                        width={300}
                                        height={300}
                                        className="rounded-lg object-contain max-h-64 w-auto max-w-full"
                                      />
                                    </div>
                                  )}
                                  <p className="whitespace-pre-wrap wrap-break-word text-sm sm:text-base leading-relaxed text-foreground/95">{message.content}</p>
                                </div>
                              ) : (
                                !message.content && isLoading ? (
                                  <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                    <p className="text-sm text-muted-foreground">Analyzing...</p>
                                  </div>
                                ) : message.content ? (
                                  <div className="text-foreground prose prose-sm max-w-none">
                                    <MarkdownRenderer content={message.content} />
                                  </div>
                                ) : null
                              )}
                            </div>
                            {message.role === 'user' && (
                              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0 shadow-sm">
                                <User className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                              </div>
                            )}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </div>
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
