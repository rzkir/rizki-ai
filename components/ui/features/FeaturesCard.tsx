"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import Link from 'next/link';

import { ArrowRight, BookOpen, Briefcase, CheckCircle2, Code, Heart, Image as ImageIcon, LucideIcon, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';

const iconMap: Record<string, LucideIcon> = {
    Code,
    Heart,
    ImageIcon,
    BookOpen,
    Briefcase,
    Video,
};

export interface Feature {
    title: string;
    description: string;
    icon: string;
    url: string;
    color: string;
    items: string[];
}

interface FeaturesCardProps {
    feature: Feature;
}

export default function FeaturesCard({ feature }: FeaturesCardProps) {
    const Icon = iconMap[feature.icon] || Code;

    return (
        <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
            <div className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <CardHeader>
                <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${feature.color} mb-4 w-fit transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105`}>
                    <Icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 mb-6">
                    {feature.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary mr-2 shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>

                <Button variant="outline" className="w-full group/btn" asChild>
                    <Link href={feature.url}>
                        Explore {feature.title}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover:translate-x-1" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
