"use client";

import Link from 'next/link';

import {
    ArrowRight,
    Check,
    Clock,
    DollarSign,
    Calendar,
    Rocket,
    ShieldCheck,
    Sparkles,
    Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

export default function Join() {
    return (
        <section className="relative overflow-hidden py-10">
            {/* Background */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-background via-background/95 to-background" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
                    {/* Left: value prop */}
                    <div className="space-y-7">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/30 hover:bg-primary/15 backdrop-blur-sm">
                                <Sparkles className="mr-2 h-3.5 w-3.5" />
                                Join & ship faster
                            </Badge>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                No credit card required
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                Build, learn, and automate with{" "}
                                <span className="text-primary drop-shadow-[0_0_14px_rgba(var(--primary),0.35)]">
                                    AI tools
                                </span>{" "}
                                that feel simple.
                            </h2>
                            <p className="text-muted-foreground text-base sm:text-lg max-w-prose">
                                One account unlocks chat workflows across education, image, video, and productivity.
                                Start free, upgrade only when you need more.
                            </p>
                        </div>

                        <ul className="grid gap-3 sm:grid-cols-2">
                            <li className="flex gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
                                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Zap className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="font-medium leading-none">Fast start</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Ready-to-use prompts & tools</p>
                                </div>
                            </li>
                            <li className="flex gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
                                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="font-medium leading-none">Private by default</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Your session stays secure</p>
                                </div>
                            </li>
                            <li className="flex gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
                                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Rocket className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="font-medium leading-none">All-in-one</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Education, pro, and creative</p>
                                </div>
                            </li>
                            <li className="flex gap-3 rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm">
                                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Check className="h-4 w-4" />
                                </span>
                                <div>
                                    <p className="font-medium leading-none">Simple UI</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Designed for daily work</p>
                                </div>
                            </li>
                        </ul>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="rounded-xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm flex gap-2">
                                <Clock className="h-5 w-5 text-primary mt-1" />
                                <div className="flex flex-col">
                                    <p className="text-2xl font-bold leading-none">2m</p>
                                    <p className="mt-1 text-xs text-muted-foreground">setup time</p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm flex gap-2">
                                <Calendar className="h-5 w-5 text-primary mt-1" />
                                <div className="flex flex-col">
                                    <p className="text-2xl font-bold leading-none">24/7</p>
                                    <p className="mt-1 text-xs text-muted-foreground">AI access</p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm flex gap-2">
                                <DollarSign className="h-5 w-5 text-primary mt-1" />
                                <div className="flex flex-col">
                                    <p className="text-2xl font-bold leading-none">Free</p>
                                    <p className="mt-1 text-xs text-muted-foreground">starter plan</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: CTA */}
                    <Card className="relative overflow-hidden border border-border/60 bg-linear-to-br from-card via-card/95 to-card/90 shadow-2xl shadow-primary/10">
                        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/0 via-primary/15 to-primary/0 blur-2xl" />

                        <CardContent className="p-7 sm:p-9">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Get started</p>
                                    <h3 className="text-xl sm:text-2xl font-semibold">Create your account</h3>
                                </div>
                                <div className="inline-flex items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 p-3 text-primary">
                                    <Rocket className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-3 text-sm text-muted-foreground">
                                Register to save your sessions, unlock more tools, and personalize your experience.
                            </p>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button
                                    size="lg"
                                    className="w-full text-base px-6 py-6 h-auto group/btn relative overflow-hidden bg-linear-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300"
                                    asChild
                                >
                                    <Link href="/signup">
                                        <span className="relative z-10 flex items-center justify-center">
                                            Start Registration
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                        </span>
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                    </Link>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full text-base px-6 py-6 h-auto border-border/70 hover:bg-accent transition-all duration-300"
                                    asChild
                                >
                                    <Link href="/signin">
                                        <span className="flex items-center justify-center">
                                            I already have an account
                                            <ArrowRight className="ml-2 h-5 w-5 opacity-70" />
                                        </span>
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-6 rounded-xl border border-border/60 bg-background/50 p-4 backdrop-blur-sm">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        Secure session
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        Free forever plan
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-amber-500" />
                                        Cancel anytime
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
