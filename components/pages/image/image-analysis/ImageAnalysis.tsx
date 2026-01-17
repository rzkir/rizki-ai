"use client";

import type React from "react";
import { useState, useRef } from "react";
import { ArrowUp, Upload, ImageIcon, Sparkles, Loader2, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { streamChat } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';
import Image from 'next/image';

export default function ImageAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedImageFile) return;

    setIsLoading(true);
    setAnalysis(null);

    const handleError = () => {
      setAnalysis('Maaf, terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    };

    try {
      // Convert image to base64
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(`data:image/${selectedImageFile.type.split('/')[1]};base64,${base64}`);
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedImageFile);
      });

      // Prepare user message
      const inputText = prompt.trim() || "What's in this image?";
      const userMessage: Message = {
        role: 'user',
        content: inputText,
        imageUrl: imageBase64
      };

      // Call API with streaming
      await streamChat({
        endpoint: API_ENDPOINTS.imageAnalyze,
        messages: [userMessage],
        onChunk: (content) => {
          setAnalysis(content);
        },
        onError: handleError
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error analyzing image:', error);
      handleError();
    }
  };

  const suggestedPrompts = [
    { icon: Sparkles, text: "Identify Objects", prompt: "What objects are in this image?" },
    { icon: ImageIcon, text: "Analyze Colors", prompt: "Describe the color palette and visual style of this image" },
    { icon: Scan, text: "Extract Text", prompt: "Extract and read any text visible in this image" },
    { icon: Sparkles, text: "Scene Description", prompt: "Describe this image in detail" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="h-20 flex items-center justify-between px-8 bg-transparent sticky top-0 z-10 border-b border-border/40">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Image Analyzer</h1>
            <p className="text-xs text-muted-foreground">Visual intelligence engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Powered by NEON.AI</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
          {!selectedImage ? (
            <div className="space-y-12 py-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter leading-none bg-gradient-to-br from-white via-white to-primary/50 bg-clip-text text-transparent">
                  Upload an image <br /> to <span className="gradient-text-purple-blue italic">analyze</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Leverage advanced computer vision to extract insights from your images instantly.
                </p>
              </div>

              {/* Upload Area */}
              <div onClick={() => fileInputRef.current?.click()} className="group relative cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-chart-3 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
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

              {/* Suggested Analysis */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Quick Analysis Types
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {suggestedPrompts.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        fileInputRef.current?.click();
                        if (item.prompt) {
                          setPrompt(item.prompt);
                        }
                      }}
                      className="group relative overflow-hidden rounded-[1.5rem] bg-card/40 hover:bg-primary/10 border border-border/50 hover:border-primary/50 p-6 transition-all hover:scale-105 flex flex-col items-start justify-center gap-3"
                    >
                      <div className="absolute -inset-full bg-gradient-to-br from-primary/20 to-chart-3/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <item.icon className="w-6 h-6 text-chart-3 relative z-10" />
                      <span className="font-bold text-foreground relative z-10">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
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
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedImageFile(null);
                      setAnalysis(null);
                      setPrompt("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
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
                      Enter a prompt or click &quot;Analyze&quot; to get insights about your image
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
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-chart-3 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition duration-1000" />
          <div className="relative bg-card/80 backdrop-blur-2xl rounded-[2.2rem] border border-border/50 p-2 flex items-center gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
              placeholder={selectedImage ? "Ask something about the image..." : "Upload an image first..."}
              disabled={!selectedImage || isLoading}
              className="flex-1 bg-transparent text-foreground rounded-2xl py-4 pl-6 pr-4 focus:outline-none resize-none min-h-[64px] max-h-40 font-medium placeholder:text-muted-foreground/50 disabled:opacity-50"
              rows={1}
            />
            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage || isLoading}
              size="icon"
              className="rounded-full h-14 w-14 bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all glow-purple"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowUp className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
