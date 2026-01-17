"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Wrench, BarChart3, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl w-full space-y-12">
          {/* Hero Section */}
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-foreground">What shall we</span>{' '}
              <span className="gradient-text-purple-blue text-6xl lg:text-8xl">construct</span>{' '}
              <span className="text-foreground">today?</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl">
              Harness the power of multi-model neural networks for your next breakthrough.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            {/* Large Card - Construct Prototype */}
            <Link href="/programming" className="lg:col-span-2">
              <Card className="h-full bg-card border-border/40 hover:border-primary/50 transition-all duration-300 hover:glow-purple cursor-pointer group">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Construct Prototype</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Generate high-fidelity UI components with React & Tailwind
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Stacked Cards */}
            <div className="space-y-6">
              {/* Refactor Code Card */}
              <Link href="/programming">
                <Card className="bg-card border-border/40 hover:border-chart-3/50 transition-all duration-300 hover:glow-teal cursor-pointer group">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Wrench className="w-10 h-10 text-chart-3" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Refactor Code</h3>
                  </CardContent>
                </Card>
              </Link>

              {/* Analyze Data Card */}
              <Link href="/programming">
                <Card className="bg-card border-border/40 hover:border-chart-3/50 transition-all duration-300 hover:glow-teal cursor-pointer group">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <BarChart3 className="w-10 h-10 text-chart-3" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Analyze Data</h3>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* AI Assistant Greeting */}
          <div className="flex items-start gap-3 max-w-2xl mx-auto lg:mx-0 mt-12">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <p className="text-foreground/90 text-sm leading-relaxed">
              Hello! I&apos;m your modern AI assistant. How can I help you today?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
